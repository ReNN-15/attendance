using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AttendanceSystem
{
    public partial class Reports : Page
    {
        private readonly string connStr = ConfigurationManager.ConnectionStrings["AttendanceDB"]?.ConnectionString;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                // Default date filter to today
                txtReportDate.Text = DateTime.Today.ToString("yyyy-MM-dd");
                
                // Populate students dropdown for TabStudent
                LoadStudentsDropdown();

                // Start on Tab Date
                SwitchTab("Date");
            }
        }

        private void LoadStudentsDropdown()
        {
            if (string.IsNullOrEmpty(connStr)) return;

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                try
                {
                    conn.Open();
                    string query = "SELECT StudentID, RollNumber + ' - ' + FullName AS DisplayName FROM Students ORDER BY Class, RollNumber";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    ddlStudentReport.DataSource = dt;
                    ddlStudentReport.DataTextField = "DisplayName";
                    ddlStudentReport.DataValueField = "StudentID";
                    ddlStudentReport.DataBind();

                    ddlStudentReport.Items.Insert(0, new ListItem("Select a Student", ""));
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine("Error loading student dropdown: " + ex.Message);
                }
            }
        }

        protected void btnTabDate_Click(object sender, EventArgs e)
        {
            SwitchTab("Date");
        }

        protected void btnTabStudent_Click(object sender, EventArgs e)
        {
            SwitchTab("Student");
        }

        protected void btnTabPercentage_Click(object sender, EventArgs e)
        {
            SwitchTab("Percentage");
        }

        private void SwitchTab(string tabName)
        {
            hfActiveTab.Value = tabName;

            // Reset tab button colors (Bootstrap classes)
            btnTabDate.CssClass = "btn btn-outline-primary py-2.5 fw-bold";
            btnTabStudent.CssClass = "btn btn-outline-primary py-2.5 fw-bold";
            btnTabPercentage.CssClass = "btn btn-outline-primary py-2.5 fw-bold";

            // Hide/Show correct grids & filters
            gvByDate.Visible = false;
            gvByStudent.Visible = false;
            gvByPercentage.Visible = false;

            pnlDateFilters.Visible = false;
            pnlClassFilters.Visible = false;
            pnlStudentFilters.Visible = false;

            if (tabName == "Date")
            {
                btnTabDate.CssClass = "btn btn-primary py-2.5 fw-bold text-white shadow-none";
                pnlDateFilters.Visible = true;
                pnlClassFilters.Visible = true;
                gvByDate.Visible = true;
                lblReportTitle.Text = "Class Attendance Ledger";
                lblPrintReportType.Text = "Attendance by Date";
            }
            else if (tabName == "Student")
            {
                btnTabStudent.CssClass = "btn btn-primary py-2.5 fw-bold text-white shadow-none";
                pnlStudentFilters.Visible = true;
                gvByStudent.Visible = true;
                lblReportTitle.Text = "Individual Attendance History";
                lblPrintReportType.Text = "Individual Student Attendance Record";
            }
            else if (tabName == "Percentage")
            {
                btnTabPercentage.CssClass = "btn btn-primary py-2.5 fw-bold text-white shadow-none";
                pnlClassFilters.Visible = true;
                gvByPercentage.Visible = true;
                lblReportTitle.Text = "Attendance Percentage Ledger";
                lblPrintReportType.Text = "Student Attendance Statistics";
            }

            GenerateReportData();
        }

        protected void btnGenerateReport_Click(object sender, EventArgs e)
        {
            GenerateReportData();
        }

        protected void txtReportDate_TextChanged(object sender, EventArgs e)
        {
            if (hfActiveTab.Value == "Date") GenerateReportData();
        }

        protected void ddlClassReport_SelectedIndexChanged(object sender, EventArgs e)
        {
            GenerateReportData();
        }

        protected void ddlStudentReport_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (hfActiveTab.Value == "Student") GenerateReportData();
        }

        private DataTable GetReportDataTable()
        {
            DataTable dt = new DataTable();
            if (string.IsNullOrEmpty(connStr)) return dt;

            string activeTab = hfActiveTab.Value;

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                try
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand();
                    cmd.Connection = conn;

                    if (activeTab == "Date")
                    {
                        DateTime targetDate = Convert.ToDateTime(txtReportDate.Text);
                        string classFilter = ddlClassReport.SelectedValue;

                        string query = @"
                            SELECT s.RollNumber, s.FullName, s.Class, s.Section, a.Status
                            FROM Students s
                            INNER JOIN Attendance a ON s.StudentID = a.StudentID
                            WHERE a.AttendanceDate = @AttendanceDate";

                        cmd.Parameters.AddWithValue("@AttendanceDate", targetDate.Date);

                        if (!string.IsNullOrEmpty(classFilter))
                        {
                            query += " AND s.Class = @Class";
                            cmd.Parameters.AddWithValue("@Class", classFilter);
                            lblPrintParams.Text = $"Date: {targetDate:yyyy-MM-dd} | Class: {classFilter}";
                        }
                        else
                        {
                            lblPrintParams.Text = $"Date: {targetDate:yyyy-MM-dd} | Class: All";
                        }

                        query += " ORDER BY s.Class, s.Section, s.RollNumber";
                        cmd.CommandText = query;
                    }
                    else if (activeTab == "Student")
                    {
                        string studentId = ddlStudentReport.SelectedValue;
                        if (string.IsNullOrEmpty(studentId))
                        {
                            lblPrintParams.Text = "No student selected";
                            return dt; // Return empty table
                        }

                        string query = @"
                            SELECT a.AttendanceDate, s.Class, s.Section, a.Status
                            FROM Attendance a
                            INNER JOIN Students s ON a.StudentID = s.StudentID
                            WHERE a.StudentID = @StudentID
                            ORDER BY a.AttendanceDate DESC";

                        cmd.CommandText = query;
                        cmd.Parameters.AddWithValue("@StudentID", studentId);
                        lblPrintParams.Text = $"Student Name: {ddlStudentReport.SelectedItem.Text}";
                    }
                    else if (activeTab == "Percentage")
                    {
                        string classFilter = ddlClassReport.SelectedValue;

                        string query = @"
                            SELECT 
                                s.RollNumber, 
                                s.FullName, 
                                s.Class, 
                                s.Section,
                                COUNT(a.AttendanceID) AS TotalClasses,
                                SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) AS PresentCount,
                                SUM(CASE WHEN a.Status = 'Absent' THEN 1 ELSE 0 END) AS AbsentCount,
                                CAST(
                                    (SUM(CASE WHEN a.Status = 'Present' THEN 1.0 ELSE 0.0 END) * 100.0 / 
                                    NULLIF(COUNT(a.AttendanceID), 0))
                                AS DECIMAL(5,1)) AS Percentage
                            FROM Students s
                            LEFT JOIN Attendance a ON s.StudentID = a.StudentID";

                        if (!string.IsNullOrEmpty(classFilter))
                        {
                            query += " WHERE s.Class = @Class";
                            cmd.Parameters.AddWithValue("@Class", classFilter);
                            lblPrintParams.Text = $"Class: {classFilter}";
                        }
                        else
                        {
                            lblPrintParams.Text = "Class: All";
                        }

                        query += @" GROUP BY s.StudentID, s.RollNumber, s.FullName, s.Class, s.Section 
                                   ORDER BY Percentage DESC, s.RollNumber";
                        cmd.CommandText = query;
                    }

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);

                    // Normalize percentages or counts for presentation in TabPercentage
                    if (activeTab == "Percentage")
                    {
                        foreach (DataRow row in dt.Rows)
                        {
                            if (row["TotalClasses"] == DBNull.Value || Convert.ToInt32(row["TotalClasses"]) == 0)
                            {
                                row["TotalClasses"] = 0;
                                row["PresentCount"] = 0;
                                row["AbsentCount"] = 0;
                                row["Percentage"] = 100.0; // If school hasn't had days, default rate is 100%
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine("Report query error: " + ex.Message);
                }
            }
            return dt;
        }

        private void GenerateReportData()
        {
            DataTable dt = GetReportDataTable();
            string activeTab = hfActiveTab.Value;

            if (activeTab == "Date")
            {
                gvByDate.DataSource = dt;
                gvByDate.DataBind();
            }
            else if (activeTab == "Student")
            {
                gvByStudent.DataSource = dt;
                gvByStudent.DataBind();
            }
            else if (activeTab == "Percentage")
            {
                gvByPercentage.DataSource = dt;
                gvByPercentage.DataBind();
            }
        }

        protected void btnExportCSV_Click(object sender, EventArgs e)
        {
            DataTable dt = GetReportDataTable();
            if (dt == null || dt.Rows.Count == 0)
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "alertNoData", "alert('No records available to export.');", true);
                return;
            }

            string csvData = ConvertDataTableToCSV(dt);
            string filename = $"AttendanceReport_{hfActiveTab.Value}_{DateTime.Now:yyyyMMdd_HHmmss}.csv";

            Response.Clear();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", "attachment;filename=" + filename);
            Response.Charset = "";
            Response.ContentType = "text/csv";
            Response.Output.Write(csvData);
            Response.Flush();
            Response.End();
        }

        private string ConvertDataTableToCSV(DataTable dt)
        {
            StringBuilder sb = new StringBuilder();

            // Append headers
            for (int k = 0; k < dt.Columns.Count; k++)
            {
                sb.Append(dt.Columns[k].ColumnName);
                if (k < dt.Columns.Count - 1)
                {
                    sb.Append(",");
                }
            }
            sb.Append("\r\n");

            // Append data rows
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                for (int k = 0; k < dt.Columns.Count; k++)
                {
                    string cellValue = dt.Rows[i][k].ToString();
                    
                    // Format dates safely
                    if (dt.Columns[k].DataType == typeof(DateTime))
                    {
                        cellValue = Convert.ToDateTime(cellValue).ToString("yyyy-MM-dd");
                    }

                    // Escape double quotes inside values, wrap in quotes if contains comma
                    if (cellValue.Contains(",") || cellValue.Contains("\"") || cellValue.Contains("\r") || cellValue.Contains("\n"))
                    {
                        cellValue = "\"" + cellValue.Replace("\"", "\"\"") + "\"";
                    }

                    sb.Append(cellValue);
                    if (k < dt.Columns.Count - 1)
                    {
                        sb.Append(",");
                    }
                }
                sb.Append("\r\n");
            }

            return sb.ToString();
        }
    }
}
