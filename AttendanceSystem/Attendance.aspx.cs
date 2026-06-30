using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AttendanceSystem
{
    public partial class Attendance : Page
    {
        private readonly string connStr = ConfigurationManager.ConnectionStrings["AttendanceDB"]?.ConnectionString;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                // Default date picker to today
                txtDate.Text = DateTime.Today.ToString("yyyy-MM-dd");
            }
        }

        protected void btnLoadSheet_Click(object sender, EventArgs e)
        {
            LoadAttendanceSheet();
        }

        protected void txtDate_TextChanged(object sender, EventArgs e)
        {
            ResetSheetPanel();
        }

        protected void ddlClassFilter_SelectedIndexChanged(object sender, EventArgs e)
        {
            ResetSheetPanel();
        }

        private void ResetSheetPanel()
        {
            pnlAttendanceSheet.Visible = false;
            pnlEmptyState.Visible = true;
            divQuickActions.Visible = false;
            lblMessage.Text = "";
        }

        private void LoadAttendanceSheet()
        {
            if (!Page.IsValid) return;

            string selectedClass = ddlClassFilter.SelectedValue;
            string selectedDateString = txtDate.Text;

            if (string.IsNullOrEmpty(selectedClass) || string.IsNullOrEmpty(selectedDateString))
            {
                ShowMessage("Please select both a date and a class.", "text-danger");
                return;
            }

            DateTime selectedDate = Convert.ToDateTime(selectedDateString);

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                try
                {
                    conn.Open();

                    // Step 1: Query students and their attendance status for the selected date if it exists.
                    // We do a LEFT JOIN to the Attendance table filtered by the specific date.
                    string query = @"
                        SELECT 
                            s.StudentID, 
                            s.RollNumber, 
                            s.FullName, 
                            s.Section, 
                            ISNULL(a.Status, 'Present') AS Status, -- Default to Present for new sheets
                            CASE WHEN a.AttendanceID IS NOT NULL THEN 1 ELSE 0 END AS IsSaved
                        FROM Students s
                        LEFT JOIN Attendance a ON s.StudentID = a.StudentID AND a.AttendanceDate = @AttendanceDate
                        WHERE s.Class = @Class
                        ORDER BY s.Section, s.RollNumber";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@AttendanceDate", selectedDate.Date);
                    cmd.Parameters.AddWithValue("@Class", selectedClass);

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    if (dt.Rows.Count == 0)
                    {
                        ShowMessage($"No students are currently registered in '{selectedClass}'.", "text-warning");
                        ResetSheetPanel();
                        return;
                    }

                    // Determine if this attendance sheet is new or editing an existing saved one
                    bool hasSavedRecords = false;
                    foreach (DataRow row in dt.Rows)
                    {
                        if (Convert.ToInt32(row["IsSaved"]) == 1)
                        {
                            hasSavedRecords = true;
                            break;
                        }
                    }

                    lblCurrentClass.Text = selectedClass;
                    lblCurrentDate.Text = selectedDate.ToString("MMMM dd, yyyy");

                    if (hasSavedRecords)
                    {
                        lblSheetStatus.Text = "<i class='bi bi-pencil-square me-1'></i> Update Mode (Already Saved)";
                        lblSheetStatus.CssClass = "badge bg-info text-white px-2 py-1";
                    }
                    else
                    {
                        lblSheetStatus.Text = "<i class='bi bi-file-earmark-plus me-1'></i> New Attendance Sheet";
                        lblSheetStatus.CssClass = "badge bg-warning text-dark px-2 py-1";
                    }

                    // Bind grid
                    gvAttendanceSheet.DataSource = dt;
                    gvAttendanceSheet.DataBind();

                    pnlAttendanceSheet.Visible = true;
                    pnlEmptyState.Visible = false;
                    divQuickActions.Visible = true;
                    lblMessage.Text = "";
                }
                catch (Exception ex)
                {
                    ShowMessage($"Error loading sheet: {ex.Message}", "text-danger");
                }
            }
        }

        protected void btnSaveAttendance_Click(object sender, EventArgs e)
        {
            if (!pnlAttendanceSheet.Visible) return;

            string selectedClass = ddlClassFilter.SelectedValue;
            DateTime selectedDate = Convert.ToDateTime(txtDate.Text);

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                SqlTransaction transaction = conn.BeginTransaction();

                try
                {
                    int saveCount = 0;

                    // Iterate through each student in the grid
                    foreach (GridViewRow row in gvAttendanceSheet.Rows)
                    {
                        if (row.RowType == DataControlRowType.DataRow)
                        {
                            int studentId = Convert.ToInt32(gvAttendanceSheet.DataKeys[row.RowIndex].Value);
                            
                            // Retrieve form value for radio button group named "status_[studentId]"
                            string radioValue = Request.Form["status_" + studentId];
                            
                            // Default fallback in case it was missed
                            if (string.IsNullOrEmpty(radioValue))
                            {
                                radioValue = "Present";
                            }

                            // Perform MERGE/UPSERT logic
                            string upsertQuery = @"
                                MERGE Attendance AS target
                                USING (SELECT @StudentID AS StudentID, @AttendanceDate AS AttendanceDate) AS source
                                ON (target.StudentID = source.StudentID AND target.AttendanceDate = source.AttendanceDate)
                                WHEN MATCHED THEN
                                    UPDATE SET Status = @Status
                                WHEN NOT MATCHED THEN
                                    INSERT (StudentID, AttendanceDate, Status) 
                                    VALUES (source.StudentID, source.AttendanceDate, @Status);";

                            SqlCommand cmd = new SqlCommand(upsertQuery, conn, transaction);
                            cmd.Parameters.AddWithValue("@StudentID", studentId);
                            cmd.Parameters.AddWithValue("@AttendanceDate", selectedDate.Date);
                            cmd.Parameters.AddWithValue("@Status", radioValue);

                            cmd.ExecuteNonQuery();
                            saveCount++;
                        }
                    }

                    // Commit transaction
                    transaction.Commit();
                    ShowMessage($"Attendance saved successfully! {saveCount} records processed.", "text-success");
                    
                    // Reload to refresh the statuses and heading state
                    LoadAttendanceSheet();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    ShowMessage($"Error saving attendance: {ex.Message}", "text-danger");
                }
            }
        }

        protected void btnMarkAllPresent_Click(object sender, EventArgs e)
        {
            BulkUpdateStatusInGrid("Present");
        }

        protected void btnMarkAllAbsent_Click(object sender, EventArgs e)
        {
            BulkUpdateStatusInGrid("Absent");
        }

        private void BulkUpdateStatusInGrid(string status)
        {
            // Re-create the data table with bulk marked status to rebind
            // Since Web Forms lacks dynamic state merge on POST, we re-query the original state
            // and apply the overriding bulk selection, then bind again.
            string selectedClass = ddlClassFilter.SelectedValue;
            DateTime selectedDate = Convert.ToDateTime(txtDate.Text);

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                try
                {
                    conn.Open();
                    string query = @"
                        SELECT 
                            s.StudentID, 
                            s.RollNumber, 
                            s.FullName, 
                            s.Section, 
                            CASE WHEN a.AttendanceID IS NOT NULL THEN 1 ELSE 0 END AS IsSaved
                        FROM Students s
                        LEFT JOIN Attendance a ON s.StudentID = a.StudentID AND a.AttendanceDate = @AttendanceDate
                        WHERE s.Class = @Class
                        ORDER BY s.Section, s.RollNumber";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@AttendanceDate", selectedDate.Date);
                    cmd.Parameters.AddWithValue("@Class", selectedClass);

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    // Add Status column manually and force it to bulk selection
                    dt.Columns.Add("Status", typeof(string));
                    foreach (DataRow row in dt.Rows)
                    {
                        row["Status"] = status;
                    }

                    gvAttendanceSheet.DataSource = dt;
                    gvAttendanceSheet.DataBind();

                    ShowMessage($"Temporary bulk action applied: Mark all '{status}'. Remember to click 'Save Attendance Sheet' to persist changes.", "text-info");
                }
                catch (Exception ex)
                {
                    ShowMessage($"Bulk action error: {ex.Message}", "text-danger");
                }
            }
        }

        private void ShowMessage(string msg, string cssClass)
        {
            lblMessage.Text = msg;
            lblMessage.CssClass = cssClass + " px-2 py-1 rounded small shadow-sm bg-white d-inline-block";
        }
    }
}
