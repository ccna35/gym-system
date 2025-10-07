export interface ITenantApplication {
  id: number;
  gym_name: string;
  subdomain: string;
  owner_name: string;
  email: string;
  phone?: string | null;
  status: TenantApplicationStatus;
  email_verified_at?: Date | null;
  review_notes?: string | null;
  created_at: Date;
  updated_at: Date;
}

export type TenantApplicationStatus =
  | "PENDING_EMAIL"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface ITenantApplicationCreate {
  gym_name: string;
  subdomain: string;
  owner_name: string;
  email: string;
  phone?: string;
}

export interface ITenantApplicationUpdate {
  gym_name?: string;
  subdomain?: string;
  owner_name?: string;
  email?: string;
  phone?: string | null;
  status?: TenantApplicationStatus;
  email_verified_at?: Date | null;
  review_notes?: string | null;
}

export class TenantApplicationModel {
  // SQL queries as static properties for reusability
  static readonly CREATE_TABLE_QUERY = `
    CREATE TABLE IF NOT EXISTS tenant_applications (
      id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      gym_name        VARCHAR(120)    NOT NULL,
      subdomain       VARCHAR(63)     NOT NULL,
      owner_name      VARCHAR(120)    NOT NULL,
      email           VARCHAR(191)    NOT NULL,
      phone           VARCHAR(32)     NULL,
      status          ENUM('PENDING_EMAIL', 'PENDING_REVIEW', 'APPROVED', 'REJECTED')
                      NOT NULL DEFAULT 'PENDING_EMAIL',
      email_verified_at DATETIME NULL,
      review_notes    VARCHAR(255)    NULL,
      created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      CONSTRAINT pk_tenant_applications PRIMARY KEY (id),
      CONSTRAINT uq_tenant_applications_email UNIQUE (email),
      CONSTRAINT uq_tenant_applications_subdomain UNIQUE (subdomain)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  static readonly INSERT_QUERY = `
    INSERT INTO tenant_applications 
    (gym_name, subdomain, owner_name, email, phone, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  static readonly SELECT_ALL_QUERY = `
    SELECT * FROM tenant_applications 
    ORDER BY created_at DESC
  `;

  static readonly SELECT_BY_ID_QUERY = `
    SELECT * FROM tenant_applications 
    WHERE id = ?
  `;

  static readonly SELECT_BY_EMAIL_QUERY = `
    SELECT * FROM tenant_applications 
    WHERE email = ?
  `;

  static readonly SELECT_BY_SUBDOMAIN_QUERY = `
    SELECT * FROM tenant_applications 
    WHERE subdomain = ?
  `;

  static readonly SELECT_BY_STATUS_QUERY = `
    SELECT * FROM tenant_applications 
    WHERE status = ?
    ORDER BY created_at DESC
  `;

  static readonly UPDATE_QUERY = `
    UPDATE tenant_applications 
    SET gym_name = ?, subdomain = ?, owner_name = ?, email = ?, 
        phone = ?, status = ?, email_verified_at = ?, review_notes = ?
    WHERE id = ?
  `;

  static readonly UPDATE_STATUS_QUERY = `
    UPDATE tenant_applications 
    SET status = ?, review_notes = ?
    WHERE id = ?
  `;

  static readonly UPDATE_EMAIL_VERIFIED_QUERY = `
    UPDATE tenant_applications 
    SET email_verified_at = ?, status = 'PENDING_REVIEW'
    WHERE id = ? AND status = 'PENDING_EMAIL'
  `;

  static readonly DELETE_QUERY = `
    DELETE FROM tenant_applications 
    WHERE id = ?
  `;

  static readonly COUNT_BY_STATUS_QUERY = `
    SELECT status, COUNT(*) as count 
    FROM tenant_applications 
    GROUP BY status
  `;
}
