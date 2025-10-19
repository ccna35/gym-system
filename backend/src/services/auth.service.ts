import * as bcrypt from "bcryptjs";
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { executeQuery } from "../db/connection";
import { IUser, UserModel } from "../models/User";
import { ResultSetHeader } from "mysql2";

export interface RegisterInput {
  tenant_id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  password: string;
  role_id: number;
}

export interface LoginInput {
  tenant_id: number;
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export class AuthService {
  static async findByTenantAndEmail(
    tenant_id: number,
    email: string
  ): Promise<IUser | null> {
    const rows = await executeQuery(UserModel.SELECT_USER_BY_TENANT_AND_EMAIL, [
      tenant_id,
      email,
    ]);
    return rows && rows.length ? (rows[0] as IUser) : null;
  }

  static async register(
    input: RegisterInput
  ): Promise<{ user: Omit<IUser, "password_hash">; token: string }> {
    const existing = await this.findByTenantAndEmail(
      input.tenant_id,
      input.email
    );
    if (existing) {
      throw new Error("Email already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(input.password, salt);

    let result: ResultSetHeader;
    try {
      result = (await executeQuery(UserModel.INSERT_USER, [
        input.tenant_id,
        input.full_name,
        input.email,
        input.phone ?? null,
        hashed,
        input.role_id,
      ])) as ResultSetHeader;
    } catch (e: unknown) {
      const error = e as { code?: string };
      if (error && error.code === "ER_BAD_FIELD_ERROR") {
        // Database schema mismatch (old users table). Surface a clear message.
        throw new Error(
          "Users table schema is outdated. Run migrations on a fresh DB or migrate existing table to multi-tenant schema."
        );
      }
      if (error && error.code === "ER_DUP_ENTRY") {
        throw new Error("Email or phone already registered for this tenant");
      }
      throw e;
    }

    const userRows = await executeQuery(
      UserModel.SELECT_USER_BY_ID_AND_TENANT,
      [result.insertId, input.tenant_id]
    );
    const user = userRows[0] as IUser;
    const safeUser = this.omitPasswordHash(user);
    const token = this.signToken(safeUser);
    return { user: safeUser, token };
  }

  static async login(
    input: LoginInput
  ): Promise<{ user: Omit<IUser, "password_hash">; token: string }> {
    const user = await this.findByTenantAndEmail(input.tenant_id, input.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const valid = await bcrypt.compare(input.password, user.password_hash);
    if (!valid) {
      throw new Error("Invalid credentials");
    }
    // Update last login timestamp (non-blocking)
    executeQuery(UserModel.UPDATE_LAST_LOGIN, [user.id, user.tenant_id]).catch(
      () => {}
    );

    const safeUser = this.omitPasswordHash(user);
    const token = this.signToken(safeUser);
    return { user: safeUser, token };
  }

  static signToken(user: Omit<IUser, "password_hash">): string {
    const payload = {
      sub: user.id,
      tenant_id: user.tenant_id,
      email: user.email,
      role_id: user.role_id,
    };
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, options);
  }

  static verifyToken(token: string): JwtPayload | string {
    return jwt.verify(token, JWT_SECRET);
  }

  static omitPasswordHash(user: IUser): Omit<IUser, "password_hash"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...rest } = user;
    return rest;
  }
}
