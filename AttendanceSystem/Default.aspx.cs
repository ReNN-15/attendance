using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;

namespace AttendanceSystem
{
    public partial class Default : Page
    {
        private readonly string connStr = ConfigurationManager.ConnectionStrings["AttendanceDB"]?.ConnectionString;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                LoadDashboardStats();
                LoadClassSummary();
            }
        }

        private void LoadDashboardStats()
        {
            if (string.IsNullOrEmpty(connStr))
            {
                ShowError("Connection string 'AttendanceDB' is missing in Web.config.");
                return;
            }

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                try
                {
                    conn.Open();

                    // 1. Get Total Students
                    string totalQuery = "SELECT COUNT(*) FROM Students";
                    SqlCommand cmdTotal = new SqlCommand(totalQuery, conn);
                    int totalStudents = Convert.ToInt32(cmdTotal.ExecuteScalar());
                    lblTotalStudents.Text = totalStudents.ToString();

                    // 2. Get Present Today
                    string presentQuery = "SELECT COUNT(*) FROM Attendance WHERE AttendanceDate = CAST(GETDATE() AS DATE) AND Status = 'Present'";
                    SqlCommand cmdPresent = new SqlCommand(presentQuery, conn);
                    int presentToday = Convert.ToInt32(cmdPresent.ExecuteScalar());
                    lblPresentToday.Text = presentToday.ToString();

                    // 3. Get Absent Today
                    string absentQuery = "SELECT COUNT(*) FROM Attendance WHERE AttendanceDate = CAST(GETDATE() AS DATE) AND Status = 'Absent'";
                    SqlCommand cmdAbsent = new SqlCommand(absentQuery, conn);
                    int absentToday = Convert.ToInt32(cmdAbsent.ExecuteScalar());
                    lblAbsentToday.Text = absentToday.ToString();

                    // 4. Calculate Percentage
                    int recordedToday = presentToday + absentToday;
                    if (recordedToday > 0)
                    {
                        double percentage = ((double)presentToday / recordedToday) * 100;
                        lblAttendancePercentage.Text = string.Format("{0:F1}%", percentage);
                    }
                    else
                    {
                        lblAttendancePercentage.Text = "0.0%";
                    }
                }
                catch (SqlException ex)
                {
                    // Fallback to zero if the DB/tables do not exist yet
                    lblTotalStudents.Text = "0";
                    lblPresentToday.Text = "0";
                    lblAbsentToday.Text = "0";
                    lblAttendancePercentage.Text = "N/A";
                    System.Diagnostics.Debug.WriteLine("Database query error: " + ex.Message);
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine("General error: " + ex.Message);
                }
            }
        }

        private void LoadClassSummary()
        {
            if (string.IsNullOrEmpty(connStr)) return;

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                try
                {
                    conn.Open();
                    string query = @"
                        SELECT 
                            s.Class, 
                            COUNT(s.StudentID) AS Total, 
                            SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) AS Present,
                            SUM(CASE WHEN a.Status = 'Absent' THEN 1 ELSE 0 END) AS Absent,
                            CAST(
                                (SUM(CASE WHEN a.Status = 'Present' THEN 1.0 ELSE 0.0 END) * 100.0 / 
                                NULLIF(COUNT(CASE WHEN a.Status IS NOT NULL THEN 1 END), 0))
                            AS DECIMAL(5,1)) AS Rate
                        FROM Students s
                        LEFT JOIN Attendance a ON s.StudentID = a.StudentID AND a.AttendanceDate = CAST(GETDATE() AS DATE)
                        GROUP BY s.Class";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    // If columns contain DBNull (because no attendance has been taken yet), replace them with default 0s and 'N/A'
                    foreach (DataRow row in dt.Rows)
                    {
                        if (row["Present"] == DBNull.Value) row["Present"] = 0;
                        if (row["Absent"] == DBNull.Value) row["Absent"] = 0;
                        if (row["Rate"] == DBNull.Value)
                        {
                            row["Rate"] = 0.0;
                        }
                    }

                    gvClassSummary.DataSource = dt;
                    gvClassSummary.DataBind();
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine("Error loading class summary: " + ex.Message);
                }
            }
        }

        private void ShowError(string msg)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "alertVal", $"alert('{msg}');", true);
        }
    }
}
