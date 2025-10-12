// CREATE TABLE tenants (
//   id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
//   name          VARCHAR(120)    NOT NULL,         -- e.g., "Downtown Gym"
//   code          VARCHAR(64)     NOT NULL,         -- stable identifier, e.g., "DTOWN"
//   subdomain     VARCHAR(120)    NULL,             -- optional: "downtown"
//   timezone      VARCHAR(64)     NOT NULL DEFAULT 'Africa/Cairo',
//   currency      VARCHAR(8)      NOT NULL DEFAULT 'EGP',
//   is_active     TINYINT(1)      NOT NULL DEFAULT 1,
//   created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

//   CONSTRAINT pk_tenants PRIMARY KEY (id),
//   CONSTRAINT uq_tenants_code UNIQUE (code),
//   CONSTRAINT uq_tenants_subdomain UNIQUE (subdomain)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

export interface ITenant {
  id: number;
  name: string;
  code: string;
  subdomain?: string | null;
  timezone: string;
  currency: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ITenantCreate {
  name: string;
  code: string;
  subdomain?: string | null;
  timezone?: string;
  currency?: string;
  is_active?: boolean;
}

export interface ITenantUpdate {
  name?: string;
  code?: string;
  subdomain?: string | null;
  timezone?: string;
  currency?: string;
  is_active?: boolean;
}

export class TenantModel {
  // SQL queries as static properties for reusability
  static readonly INSERT_QUERY = `
    INSERT INTO tenants 
    (name, code, subdomain, timezone, currency, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  static readonly SELECT_ALL_QUERY = `
    SELECT * FROM tenants
    ORDER BY created_at DESC
  `;

  static readonly SELECT_BY_ID_QUERY = `
    SELECT * FROM tenants
    WHERE id = ?
  `;

  static readonly SELECT_BY_CODE_QUERY = `
    SELECT * FROM tenants
    WHERE code = ?
  `;

  static readonly UPDATE_QUERY = `
    UPDATE tenants
    SET name = ?, code = ?, subdomain = ?, timezone = ?, currency = ?, is_active = ?
    WHERE id = ?
  `;

  static readonly DELETE_QUERY = `
    DELETE FROM tenants
    WHERE id = ?
    `;
}
