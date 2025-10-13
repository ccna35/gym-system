export interface IUser {
  id: number;
  tenant_id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  password_hash: string;
  role_id: number;
  is_active: 1 | 0 | boolean;
  last_login_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static readonly INSERT_USER = `
    INSERT INTO users (tenant_id, full_name, email, phone, password_hash, role_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  static readonly SELECT_USER_BY_TENANT_AND_EMAIL = `
    SELECT * FROM users WHERE tenant_id = ? AND email = ? LIMIT 1
  `;

  static readonly SELECT_USER_BY_ID_AND_TENANT = `
    SELECT * FROM users WHERE id = ? AND tenant_id = ? LIMIT 1
  `;

  static readonly UPDATE_LAST_LOGIN = `
    UPDATE users SET last_login_at = NOW() WHERE id = ? AND tenant_id = ?
  `;
}
