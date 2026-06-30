using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AttendanceSystem
{
    public partial class Students : Page
    {
        private readonly string connStr = ConfigurationManager.ConnectionStrings["AttendanceDB"]?.ConnectionString;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                BindStudentGrid();
            }
        }

        private void BindStudentGrid(string searchKeyword = "")
        {
            if (string.IsNullOrEmpty(connStr)) return;

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                try
                {
                    string query = "SELECT StudentID, RollNumber, FullName, Class, Section FROM Students";
                    SqlCommand cmd = new SqlCommand();
                    cmd.Connection = conn;

                    if (!string.IsNullOrEmpty(searchKeyword))
                    {
                        query += " WHERE RollNumber LIKE @Keyword OR FullName LIKE @Keyword";
                        cmd.Parameters.AddWithValue("@Keyword", "%" + searchKeyword.Trim() + "%");
                    }

                    query += " ORDER BY Class, Section, RollNumber";
                    cmd.CommandText = query;

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    gvStudents.DataSource = dt;
                    gvStudents.DataBind();
                }
                catch (Exception ex)
                {
                    ShowMessage($"Error loading students: {ex.Message}", "text-danger");
                }
            }
        }

        protected void btnSave_Click(object sender, EventArgs e)
        {
            if (!Page.IsValid) return;

            string rollNo = txtRollNumber.Text.Trim();
            string name = txtFullName.Text.Trim();
            string grade = ddlClass.SelectedValue;
            string section = ddlSection.SelectedValue;
            string studentId = hfStudentID.Value;

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                try
                {
                    conn.Open();

                    if (string.IsNullOrEmpty(studentId))
                    {
                        // Duplicate check for RollNumber
                        string checkQuery = "SELECT COUNT(*) FROM Students WHERE RollNumber = @RollNumber";
                        SqlCommand cmdCheck = new SqlCommand(checkQuery, conn);
                        cmdCheck.Parameters.AddWithValue("@RollNumber", rollNo);
                        int exists = Convert.ToInt32(cmdCheck.ExecuteScalar());

                        if (exists > 0)
                        {
                            ShowMessage($"Roll number '{rollNo}' is already registered.", "text-danger");
                            return;
                        }

                        // Insert new student
                        string insertQuery = @"
                            INSERT INTO Students (RollNumber, FullName, Class, Section) 
                            VALUES (@RollNumber, @FullName, @Class, @Section)";
                        SqlCommand cmdInsert = new SqlCommand(insertQuery, conn);
                        cmdInsert.Parameters.AddWithValue("@RollNumber", rollNo);
                        cmdInsert.Parameters.AddWithValue("@FullName", name);
                        cmdInsert.Parameters.AddWithValue("@Class", grade);
                        cmdInsert.Parameters.AddWithValue("@Section", section);

                        cmdInsert.ExecuteNonQuery();
                        ShowMessage("Student added successfully!", "text-success");
                    }
                    else
                    {
                        // Duplicate check for RollNumber (excluding current student)
                        string checkQuery = "SELECT COUNT(*) FROM Students WHERE RollNumber = @RollNumber AND StudentID != @StudentID";
                        SqlCommand cmdCheck = new SqlCommand(checkQuery, conn);
                        cmdCheck.Parameters.AddWithValue("@RollNumber", rollNo);
                        cmdCheck.Parameters.AddWithValue("@StudentID", studentId);
                        int exists = Convert.ToInt32(cmdCheck.ExecuteScalar());

                        if (exists > 0)
                        {
                            ShowMessage($"Roll number '{rollNo}' is already registered to another student.", "text-danger");
                            return;
                        }

                        // Update existing student
                        string updateQuery = @"
                            UPDATE Students 
                            SET RollNumber = @RollNumber, FullName = @FullName, Class = @Class, Section = @Section 
                            WHERE StudentID = @StudentID";
                        SqlCommand cmdUpdate = new SqlCommand(updateQuery, conn);
                        cmdUpdate.Parameters.AddWithValue("@RollNumber", rollNo);
                        cmdUpdate.Parameters.AddWithValue("@FullName", name);
                        cmdUpdate.Parameters.AddWithValue("@Class", grade);
                        cmdUpdate.Parameters.AddWithValue("@Section", section);
                        cmdUpdate.Parameters.AddWithValue("@StudentID", studentId);

                        cmdUpdate.ExecuteNonQuery();
                        ShowMessage("Student updated successfully!", "text-success");
                    }

                    ClearForm();
                    BindStudentGrid();
                }
                catch (Exception ex)
                {
                    ShowMessage($"Database error: {ex.Message}", "text-danger");
                }
            }
        }

        protected void gvStudents_RowEditing(object sender, GridViewEditEventArgs e)
        {
            // We implement custom row editing to load data into the sidebar form
            int studentId = Convert.ToInt32(gvStudents.DataKeys[e.NewEditIndex].Value);
            LoadStudentToForm(studentId);
            e.Cancel = true; // Prevent the default grid edit state
        }

        private void LoadStudentToForm(int studentId)
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                try
                {
                    conn.Open();
                    string query = "SELECT StudentID, RollNumber, FullName, Class, Section FROM Students WHERE StudentID = @StudentID";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@StudentID", studentId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            hfStudentID.Value = reader["StudentID"].ToString();
                            txtRollNumber.Text = reader["RollNumber"].ToString();
                            txtFullName.Text = reader["FullName"].ToString();
                            ddlClass.SelectedValue = reader["Class"].ToString();
                            ddlSection.SelectedValue = reader["Section"].ToString();

                            lblFormTitle.Text = "Edit Student Profile";
                            btnSave.Text = "Update Student";
                            btnCancel.Visible = true;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ShowMessage($"Error loading student details: {ex.Message}", "text-danger");
                }
            }
        }

        protected void gvStudents_RowDeleting(object sender, GridViewDeleteEventArgs e)
        {
            int studentId = Convert.ToInt32(gvStudents.DataKeys[e.RowIndex].Value);

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                try
                {
                    conn.Open();
                    
                    // Attendance records are deleted cascadingly due to ON DELETE CASCADE
                    string deleteQuery = "DELETE FROM Students WHERE StudentID = @StudentID";
                    SqlCommand cmd = new SqlCommand(deleteQuery, conn);
                    cmd.Parameters.AddWithValue("@StudentID", studentId);
                    cmd.ExecuteNonQuery();

                    ShowMessage("Student profile and attendance history deleted.", "text-success");
                    
                    // If we were editing this student, clear form
                    if (hfStudentID.Value == studentId.ToString())
                    {
                        ClearForm();
                    }

                    BindStudentGrid();
                }
                catch (Exception ex)
                {
                    ShowMessage($"Error deleting student: {ex.Message}", "text-danger");
                }
            }
        }

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            BindStudentGrid(txtSearch.Text);
        }

        protected void btnClearSearch_Click(object sender, EventArgs e)
        {
            txtSearch.Text = "";
            BindStudentGrid();
        }

        protected void btnCancel_Click(object sender, EventArgs e)
        {
            ClearForm();
        }

        private void ClearForm()
        {
            hfStudentID.Value = "";
            txtRollNumber.Text = "";
            txtFullName.Text = "";
            ddlClass.SelectedIndex = 0;
            ddlSection.SelectedIndex = 0;

            lblFormTitle.Text = "Add New Student";
            btnSave.Text = "Save Student";
            btnCancel.Visible = false;
        }

        private void ShowMessage(string msg, string cssClass)
        {
            lblStatusMessage.Text = msg;
            lblStatusMessage.CssClass = cssClass + " px-2 py-1 rounded small shadow-sm bg-white d-inline-block";
        }
    }
}
