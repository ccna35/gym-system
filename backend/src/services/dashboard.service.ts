import { executeQuery } from "../db/connection";

export interface DashboardSummary {
  total_members: number;
  active_members: number;
  expiring_soon_members: number;
  expired_members: number;
  totalRevenue?: number;
}

export class DashboardService {
  static async getSummary(tenant_id: number): Promise<DashboardSummary> {
    // Compute member counts by derived membership status based on latest membership end_date
    const query = `
      WITH member_status AS (
        SELECT 
          m.id,
          CASE
            WHEN MAX(ms.end_date) < NOW() THEN 'EXPIRED'
            WHEN MAX(ms.end_date) <= DATE_ADD(NOW(), INTERVAL 7 DAY) THEN 'EXPIRING_SOON'
            ELSE 'ACTIVE'
          END AS membership_status
        FROM members m
        LEFT JOIN memberships ms 
          ON ms.member_id = m.id 
          AND ms.tenant_id = m.tenant_id
          AND ms.status IN ('ACTIVE', 'EXPIRED')
        WHERE m.tenant_id = ?
        GROUP BY m.id
      )
      SELECT 
        COUNT(*) AS total_members,
        SUM(membership_status = 'ACTIVE') AS active_members,
        SUM(membership_status = 'EXPIRING_SOON') AS expiring_soon_members,
        SUM(membership_status = 'EXPIRED') AS expired_members
      FROM member_status;
    `;

    const rows = await executeQuery(query, [tenant_id]);
    const row =
      rows && rows.length
        ? rows[0]
        : {
            total_members: 0,
            active_members: 0,
            expiring_soon_members: 0,
            expired_members: 0,
          };
    // Ensure numbers
    return {
      total_members: Number(row.total_members) || 0,
      active_members: Number(row.active_members) || 0,
      expiring_soon_members: Number(row.expiring_soon_members) || 0,
      expired_members: Number(row.expired_members) || 0,
    };
  }
}
