// Static definitions of all C# and ASP.NET Web Forms files for the source explorer
export interface SourceFile {
  path: string;
  filename: string;
  language: string;
  content: string;
}

export const sourceFiles: SourceFile[] = [
  {
    path: "AttendanceSystem.sln",
    filename: "AttendanceSystem.sln",
    language: "xml",
    content: `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.12.35527.113
MinimumVisualStudioVersion = 10.0.40219.1
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "AttendanceSystem", "AttendanceSystem\\AttendanceSystem.csproj", "{4B481079-D3E9-462A-AF15-62D2BC2BCB6A}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{4B481079-D3E9-462A-AF15-62D2BC2BCB6A}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{4B481079-D3E9-462A-AF15-62D2BC2BCB6A}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{4B481079-D3E9-462A-AF15-62D2BC2BCB6A}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{4B481079-D3E9-462A-AF15-62D2BC2BCB6A}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
	GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
EndGlobal`
  },
  {
    path: "AttendanceSystem/AttendanceSystem.csproj",
    filename: "AttendanceSystem.csproj",
    language: "xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="12.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <Import Project="$(MSBuildExtensionsPath)\\$(MSBuildToolsVersion)\\Microsoft.Common.props" Condition="Exists('$(MSBuildExtensionsPath)\\$(MSBuildToolsVersion)\\Microsoft.Common.props')" />
  <PropertyGroup>
    <Configuration Condition=" '$(Configuration)' == '' ">Debug</Configuration>
    <Platform Condition=" '$(Platform)' == '' ">AnyCPU</Platform>
    <ProjectGuid>{4B481079-D3E9-462A-AF15-62D2BC2BCB6A}</ProjectGuid>
    <ProjectTypeGuids>{349c5851-65df-11da-9384-00065b846f21};{fae04ec0-301f-11d3-bf4b-00c04f79efbc}</ProjectTypeGuids>
    <OutputType>Library</OutputType>
    <AppDesignerFolder>Properties</AppDesignerFolder>
    <RootNamespace>AttendanceSystem</RootNamespace>
    <AssemblyName>AttendanceSystem</AssemblyName>
    <TargetFrameworkVersion>v4.8</TargetFrameworkVersion>
    <UseIISExpress>true</UseIISExpress>
    <Use64BitIISExpress />
  </PropertyGroup>
  <ItemGroup>
    <Reference Include="System" />
    <Reference Include="System.Data" />
    <Reference Include="System.Web" />
    <Reference Include="System.Configuration" />
  </ItemGroup>
  <ItemGroup>
    <Content Include="CSS\\style.css" />
    <Content Include="Default.aspx" />
    <Content Include="Students.aspx" />
    <Content Include="Attendance.aspx" />
    <Content Include="Reports.aspx" />
    <Content Include="Site.Master" />
    <Content Include="App_Data\\Database.sql" />
    <Content Include="Web.config" />
  </ItemGroup>
  <ItemGroup>
    <Compile Include="Default.aspx.cs">
      <DependentUpon>Default.aspx</DependentUpon>
    </Compile>
    <Compile Include="Students.aspx.cs">
      <DependentUpon>Students.aspx</DependentUpon>
    </Compile>
    <Compile Include="Attendance.aspx.cs">
      <DependentUpon>Attendance.aspx</DependentUpon>
    </Compile>
    <Compile Include="Reports.aspx.cs">
      <DependentUpon>Reports.aspx</DependentUpon>
    </Compile>
    <Compile Include="Site.Master.cs">
      <DependentUpon>Site.Master</DependentUpon>
    </Compile>
  </ItemGroup>
</Project>`
  },
  {
    path: "AttendanceSystem/Web.config",
    filename: "Web.config",
    language: "xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <connectionStrings>
    <!-- Option A: Standard LocalDB database connection -->
    <add name="AttendanceDB" 
         connectionString="Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=AttendanceDB;Integrated Security=True;TrustServerCertificate=True" 
         providerName="System.Data.SqlClient" />
  </connectionStrings>
  <system.web>
    <compilation debug="true" targetFramework="4.8" />
    <httpRuntime targetFramework="4.8" />
  </system.web>
  <system.webServer>
    <defaultDocument>
      <files>
        <clear />
        <add value="Default.aspx" />
      </files>
    </defaultDocument>
  </system.webServer>
</configuration>`
  },
  {
    path: "AttendanceSystem/Site.Master",
    filename: "Site.Master",
    language: "html",
    content: `<%@ Master Language="C#" AutoEventWireup="true" CodeBehind="Site.master.cs" Inherits="AttendanceSystem.Site" %>
<!DOCTYPE html>
<html lang="en">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%: Page.Title %> - Student Attendance Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="~/CSS/style.css" rel="stylesheet" />
</head>
<body class="bg-light d-flex flex-column min-vh-100">
    <form runat="server">
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div class="container">
                <a class="navbar-brand" href="Default.aspx">AttendancePro</a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="Default.aspx">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link" href="Students.aspx">Students</a></li>
                        <li class="nav-item"><a class="nav-link" href="Attendance.aspx">Attendance</a></li>
                        <li class="nav-item"><a class="nav-link" href="Reports.aspx">Reports</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <main class="container my-4 flex-grow-1">
            <asp:ContentPlaceHolder ID="MainContent" runat="server"></asp:ContentPlaceHolder>
        </main>
    </form>
</body>
</html>`
  },
  {
    path: "AttendanceSystem/Site.Master.cs",
    filename: "Site.Master.cs",
    language: "csharp",
    content: `using System;
using System.Web.UI;

namespace AttendanceSystem
{
    public partial class Site : MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }
    }
}`
  },
  {
    path: "AttendanceSystem/Default.aspx",
    filename: "Default.aspx",
    language: "html",
    content: `<%@ Page Title="Dashboard" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="AttendanceSystem.Default" %>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row g-4 mb-4">
        <!-- Total Students -->
        <div class="col-md-3">
            <div class="card border-start border-primary border-4 h-100 shadow-sm">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Students</div>
                    <div class="h2 mb-0 fw-bold"><asp:Label ID="lblTotalStudents" runat="server" Text="0"></asp:Label></div>
                </div>
            </div>
        </div>
        <!-- Present Today -->
        <div class="col-md-3">
            <div class="card border-start border-success border-4 h-100 shadow-sm">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Present Today</div>
                    <div class="h2 mb-0 fw-bold text-success"><asp:Label ID="lblPresentToday" runat="server" Text="0"></asp:Label></div>
                </div>
            </div>
        </div>
        <!-- Absent Today -->
        <div class="col-md-3">
            <div class="card border-start border-danger border-4 h-100 shadow-sm">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">Absent Today</div>
                    <div class="h2 mb-0 fw-bold text-danger"><asp:Label ID="lblAbsentToday" runat="server" Text="0"></asp:Label></div>
                </div>
            </div>
        </div>
        <!-- Attendance Percentage -->
        <div class="col-md-3">
            <div class="card border-start border-info border-4 h-100 shadow-sm">
                <div class="card-body">
                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Attendance Rate</div>
                    <div class="h2 mb-0 fw-bold text-info"><asp:Label ID="lblAttendancePercentage" runat="server" Text="0%"></asp:Label></div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>`
  },
  {
    path: "AttendanceSystem/Default.aspx.cs",
    filename: "Default.aspx.cs",
    language: "csharp",
    content: `using System;
using System.Configuration;
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
            }
        }

        private void LoadDashboardStats()
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                try
                {
                    conn.Open();
                    // 1. Total Students
                    SqlCommand cmdTotal = new SqlCommand("SELECT COUNT(*) FROM Students", conn);
                    int totalStudents = Convert.ToInt32(cmdTotal.ExecuteScalar());
                    lblTotalStudents.Text = totalStudents.ToString();

                    // 2. Present Today
                    SqlCommand cmdPresent = new SqlCommand("SELECT COUNT(*) FROM Attendance WHERE AttendanceDate = CAST(GETDATE() AS DATE) AND Status = 'Present'", conn);
                    int presentToday = Convert.ToInt32(cmdPresent.ExecuteScalar());
                    lblPresentToday.Text = presentToday.ToString();

                    // 3. Absent Today
                    SqlCommand cmdAbsent = new SqlCommand("SELECT COUNT(*) FROM Attendance WHERE AttendanceDate = CAST(GETDATE() AS DATE) AND Status = 'Absent'", conn);
                    int absentToday = Convert.ToInt32(cmdAbsent.ExecuteScalar());
                    lblAbsentToday.Text = absentToday.ToString();

                    // 4. Percentage
                    int recorded = presentToday + absentToday;
                    lblAttendancePercentage.Text = recorded > 0 ? $"{(double)presentToday * 100 / recorded:F1}%" : "0.0%";
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine("Stats error: " + ex.Message);
                }
            }
        }
    }
}`
  },
  {
    path: "AttendanceSystem/Students.aspx",
    filename: "Students.aspx",
    language: "html",
    content: `<%@ Page Title="Students" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Students.aspx.cs" Inherits="AttendanceSystem.Students" %>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row g-4">
        <div class="col-lg-4">
            <div class="card shadow-sm border-0">
                <div class="card-header bg-primary text-white py-3">
                    <h5 class="mb-0 fw-bold"><asp:Label ID="lblFormTitle" runat="server" Text="Add New Student"></asp:Label></h5>
                </div>
                <div class="card-body">
                    <asp:HiddenField ID="hfStudentID" runat="server" />
                    <div class="mb-3">
                        <label class="form-label">Roll Number</label>
                        <asp:TextBox ID="txtRollNumber" runat="server" CssClass="form-control"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvRollNumber" runat="server" ControlToValidate="txtRollNumber" ErrorMessage="Roll is required." CssClass="text-danger small" ValidationGroup="StudentForm"></asp:RequiredFieldValidator>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Full Name</label>
                        <asp:TextBox ID="txtFullName" runat="server" CssClass="form-control"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvFullName" runat="server" ControlToValidate="txtFullName" ErrorMessage="Name is required." CssClass="text-danger small" ValidationGroup="StudentForm"></asp:RequiredFieldValidator>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Class</label>
                        <asp:DropDownList ID="ddlClass" runat="server" CssClass="form-select">
                            <asp:ListItem Text="Select Class" Value=""></asp:ListItem>
                            <asp:ListItem Text="Grade 10" Value="Grade 10"></asp:ListItem>
                            <asp:ListItem Text="Grade 11" Value="Grade 11"></asp:ListItem>
                            <asp:ListItem Text="Grade 12" Value="Grade 12"></asp:ListItem>
                        </asp:DropDownList>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Section</label>
                        <asp:DropDownList ID="ddlSection" runat="server" CssClass="form-select">
                            <asp:ListItem Text="Select Section" Value=""></asp:ListItem>
                            <asp:ListItem Text="A" Value="A"></asp:ListItem>
                            <asp:ListItem Text="B" Value="B"></asp:ListItem>
                        </asp:DropDownList>
                    </div>
                    <asp:Button ID="btnSave" runat="server" Text="Save Student" CssClass="btn btn-primary w-100" ValidationGroup="StudentForm" OnClick="btnSave_Click" />
                </div>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="card shadow-sm border-0">
                <div class="card-header bg-white py-3">
                    <asp:TextBox ID="txtSearch" runat="server" CssClass="form-control d-inline-block w-50" placeholder="Search..."></asp:TextBox>
                    <asp:Button ID="btnSearch" runat="server" Text="Search" CssClass="btn btn-primary ms-2" OnClick="btnSearch_Click" />
                </div>
                <div class="card-body p-0">
                    <asp:GridView ID="gvStudents" runat="server" AutoGenerateColumns="False" CssClass="table" DataKeyNames="StudentID" OnRowEditing="gvStudents_RowEditing" OnRowDeleting="gvStudents_RowDeleting">
                        <Columns>
                            <asp:BoundField DataField="RollNumber" HeaderText="Roll" />
                            <asp:BoundField DataField="FullName" HeaderText="Name" />
                            <asp:BoundField DataField="Class" HeaderText="Class" />
                            <asp:BoundField DataField="Section" HeaderText="Section" />
                            <asp:CommandField ShowEditButton="True" ShowDeleteButton="True" ControlStyle-CssClass="btn btn-sm btn-outline-secondary" />
                        </Columns>
                    </asp:GridView>
                </div>
            </div>
        </div>
    </div>
</asp:Content>`
  },
  {
    path: "AttendanceSystem/Students.aspx.cs",
    filename: "Students.aspx.cs",
    language: "csharp",
    content: `using System;
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

        private void BindStudentGrid(string search = "")
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                string query = "SELECT * FROM Students";
                if (!string.IsNullOrEmpty(search))
                    query += " WHERE RollNumber LIKE @search OR FullName LIKE @search";
                
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@search", "%" + search + "%");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);
                gvStudents.DataSource = dt;
                gvStudents.DataBind();
            }
        }

        protected void btnSave_Click(object sender, EventArgs e)
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                string query = "";
                if (string.IsNullOrEmpty(hfStudentID.Value))
                    query = "INSERT INTO Students (RollNumber, FullName, Class, Section) VALUES (@Roll, @Name, @Class, @Sec)";
                else
                    query = "UPDATE Students SET RollNumber=@Roll, FullName=@Name, Class=@Class, Section=@Sec WHERE StudentID=@ID";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Roll", txtRollNumber.Text);
                cmd.Parameters.AddWithValue("@Name", txtFullName.Text);
                cmd.Parameters.AddWithValue("@Class", ddlClass.SelectedValue);
                cmd.Parameters.AddWithValue("@Sec", ddlSection.SelectedValue);
                if (!string.IsNullOrEmpty(hfStudentID.Value))
                    cmd.Parameters.AddWithValue("@ID", hfStudentID.Value);

                cmd.ExecuteNonQuery();
            }
            BindStudentGrid();
        }

        protected void gvStudents_RowEditing(object sender, GridViewEditEventArgs e)
        {
            int studentID = Convert.ToInt32(gvStudents.DataKeys[e.NewEditIndex].Value);
            LoadStudentToForm(studentID);
            e.Cancel = true;
        }

        protected void gvStudents_RowDeleting(object sender, GridViewDeleteEventArgs e)
        {
            int studentID = Convert.ToInt32(gvStudents.DataKeys[e.RowIndex].Value);
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand("DELETE FROM Students WHERE StudentID=@ID", conn);
                cmd.Parameters.AddWithValue("@ID", studentID);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
            BindStudentGrid();
        }
    }
}`
  },
  {
    path: "AttendanceSystem/Attendance.aspx",
    filename: "Attendance.aspx",
    language: "html",
    content: `<%@ Page Title="Attendance" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Attendance.aspx.cs" Inherits="AttendanceSystem.Attendance" %>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="card mb-4 shadow-sm border-0">
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <div class="col-md-3">
                    <label class="form-label fw-bold">Date</label>
                    <asp:TextBox ID="txtDate" runat="server" CssClass="form-control" TextMode="Date"></asp:TextBox>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-bold">Class</label>
                    <asp:DropDownList ID="ddlClassFilter" runat="server" CssClass="form-select">
                        <asp:ListItem Text="Select Class" Value=""></asp:ListItem>
                        <asp:ListItem Text="Grade 10" Value="Grade 10"></asp:ListItem>
                        <asp:ListItem Text="Grade 11" Value="Grade 11"></asp:ListItem>
                    </asp:DropDownList>
                </div>
                <div class="col-md-3">
                    <asp:Button ID="btnLoadSheet" runat="server" Text="Load Sheet" CssClass="btn btn-primary w-100" OnClick="btnLoadSheet_Click" />
                </div>
            </div>
        </div>
    </div>
    <asp:Panel ID="pnlAttendanceSheet" runat="server" Visible="false">
        <asp:GridView ID="gvAttendanceSheet" runat="server" AutoGenerateColumns="False" CssClass="table" DataKeyNames="StudentID">
            <Columns>
                <asp:BoundField DataField="RollNumber" HeaderText="Roll" />
                <asp:BoundField DataField="FullName" HeaderText="Name" />
                <asp:TemplateField HeaderText="Status">
                    <ItemTemplate>
                        <input type="radio" name='status_<%# Eval("StudentID") %>' value="Present" <%# Eval("Status").ToString() == "Present" ? "checked" : "" %> /> Present
                        <input type="radio" name='status_<%# Eval("StudentID") %>' value="Absent" <%# Eval("Status").ToString() == "Absent" ? "checked" : "" %> /> Absent
                    </ItemTemplate>
                </asp:TemplateField>
            </Columns>
        </asp:GridView>
        <asp:Button ID="btnSaveAttendance" runat="server" Text="Save Attendance Sheet" CssClass="btn btn-success" OnClick="btnSaveAttendance_Click" />
    </asp:Panel>
</asp:Content>`
  },
  {
    path: "AttendanceSystem/Attendance.aspx.cs",
    filename: "Attendance.aspx.cs",
    language: "csharp",
    content: `using System;
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
                txtDate.Text = DateTime.Today.ToString("yyyy-MM-dd");
        }

        protected void btnLoadSheet_Click(object sender, EventArgs e)
        {
            LoadAttendanceSheet();
        }

        private void LoadAttendanceSheet()
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                string query = @"SELECT s.StudentID, s.RollNumber, s.FullName, ISNULL(a.Status, 'Present') AS Status
                                 FROM Students s
                                 LEFT JOIN Attendance a ON s.StudentID = a.StudentID AND a.AttendanceDate = @date
                                 WHERE s.Class = @class";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@date", Convert.ToDateTime(txtDate.Text));
                cmd.Parameters.AddWithValue("@class", ddlClassFilter.SelectedValue);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);
                gvAttendanceSheet.DataSource = dt;
                gvAttendanceSheet.DataBind();
                pnlAttendanceSheet.Visible = true;
            }
        }

        protected void btnSaveAttendance_Click(object sender, EventArgs e)
        {
            try
            {
                int saveCount = 0;

                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    conn.Open();

                    // Iterate through each student in the grid
                    foreach (GridViewRow row in gvAttendanceSheet.Rows)
                    {
                        if (row.RowType == DataControlRowType.DataRow)
                        {
                            int studentId = Convert.ToInt32(gvAttendanceSheet.DataKeys[row.RowIndex].Value);
                            string status = Request.Form["status_" + studentId];
                            if (string.IsNullOrEmpty(status)) status = "Present";

                            string query = @"MERGE Attendance AS t
                                             USING (SELECT @studentId AS StudentID, @date AS AttendanceDate) AS s
                                             ON (t.StudentID = s.StudentID AND t.AttendanceDate = s.AttendanceDate)
                                             WHEN MATCHED THEN UPDATE SET Status = @status
                                             WHEN NOT MATCHED THEN INSERT (StudentID, AttendanceDate, Status) VALUES (@studentId, @date, @status);";
                            SqlCommand cmd = new SqlCommand(query, conn);
                            cmd.Parameters.AddWithValue("@studentId", studentId);
                            cmd.Parameters.AddWithValue("@date", Convert.ToDateTime(txtDate.Text));
                            cmd.Parameters.AddWithValue("@status", status);
                            cmd.ExecuteNonQuery();
                            saveCount++;
                        }
                    }
                }
                LoadAttendanceSheet();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Save error: " + ex.Message);
            }
        }
    }
}`
  },
  {
    path: "AttendanceSystem/Reports.aspx",
    filename: "Reports.aspx",
    language: "html",
    content: `<%@ Page Title="Reports" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Reports.aspx.cs" Inherits="AttendanceSystem.Reports" %>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row mb-4">
        <asp:Button ID="btnTabDate" runat="server" Text="By Date" CssClass="btn btn-outline-primary" OnClick="btnTabDate_Click" />
        <asp:Button ID="btnTabStudent" runat="server" Text="By Student" CssClass="btn btn-outline-primary" OnClick="btnTabStudent_Click" />
    </div>
    <asp:GridView ID="gvByDate" runat="server" CssClass="table"></asp:GridView>
</asp:Content>`
  },
  {
    path: "AttendanceSystem/Reports.aspx.cs",
    filename: "Reports.aspx.cs",
    language: "csharp",
    content: `using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Web.UI;

namespace AttendanceSystem
{
    public partial class Reports : Page
    {
        private readonly string connStr = ConfigurationManager.ConnectionStrings["AttendanceDB"]?.ConnectionString;

        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected void btnExportCSV_Click(object sender, EventArgs e)
        {
            DataTable dt = GetReportData();
            StringBuilder sb = new StringBuilder();
            foreach (DataColumn col in dt.Columns) sb.Append(col.ColumnName + ",");
            sb.Append("\\r\\n");
            foreach (DataRow row in dt.Rows)
            {
                foreach (var item in row.ItemArray) sb.Append(item.ToString() + ",");
                sb.Append("\\r\\n");
            }
            Response.Clear();
            Response.AddHeader("content-disposition", "attachment;filename=Report.csv");
            Response.ContentType = "text/csv";
            Response.Write(sb.ToString());
            Response.End();
        }

        private DataTable GetReportData()
        {
            // Implementation of data query...
            return new DataTable();
        }
    }
}`
  },
  {
    path: "AttendanceSystem/App_Data/Database.sql",
    filename: "Database.sql",
    language: "sql",
    content: `-- Create Students Table
CREATE TABLE Students (
    StudentID INT IDENTITY(1,1) PRIMARY KEY,
    RollNumber NVARCHAR(50) NOT NULL UNIQUE,
    FullName NVARCHAR(150) NOT NULL,
    Class NVARCHAR(50) NOT NULL,
    Section NVARCHAR(50) NOT NULL
);

-- Create Attendance Table
CREATE TABLE Attendance (
    AttendanceID INT IDENTITY(1,1) PRIMARY KEY,
    StudentID INT NOT NULL,
    AttendanceDate DATE NOT NULL,
    Status NVARCHAR(10) NOT NULL, -- 'Present' or 'Absent'
    CONSTRAINT FK_Attendance_Students FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE,
    CONSTRAINT UQ_Student_Date UNIQUE (StudentID, AttendanceDate)
);`
  }
];
