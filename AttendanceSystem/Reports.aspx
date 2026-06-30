<%@ Page Title="Reports" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Reports.aspx.cs" Inherits="AttendanceSystem.Reports" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Header -->
    <div class="row mb-4 no-print">
        <div class="col-12 d-flex justify-content-between align-items-center">
            <div>
                <h1 class="h2 text-gray-900 font-sans font-medium tracking-tight">Reports & Analytics</h1>
                <p class="text-muted">Generate summaries, audit records, review individual student records, or export data.</p>
            </div>
            <div class="d-flex gap-2">
                <button type="button" class="btn btn-outline-primary d-flex align-items-center" onclick="window.print();">
                    <i class="bi bi-printer me-1"></i> Print Report
                </button>
                <asp:Button ID="btnExportCSV" runat="server" Text="Export to CSV" CssClass="btn btn-success fw-bold" OnClick="btnExportCSV_Click" />
            </div>
        </div>
    </div>

    <!-- Tab Selector Navigation -->
    <div class="row mb-4 no-print">
        <div class="col-12">
            <div class="btn-group w-100 shadow-sm" role="group">
                <asp:Button ID="btnTabDate" runat="server" Text="Attendance by Date" CssClass="btn py-2.5 fw-bold" OnClick="btnTabDate_Click" />
                <asp:Button ID="btnTabStudent" runat="server" Text="Attendance by Student" CssClass="btn py-2.5 fw-bold" OnClick="btnTabStudent_Click" />
                <asp:Button ID="btnTabPercentage" runat="server" Text="Attendance Percentage Ledger" CssClass="btn py-2.5 fw-bold" OnClick="btnTabPercentage_Click" />
            </div>
        </div>
    </div>

    <!-- Active Filter Panel -->
    <div class="card shadow-sm border-0 mb-4 no-print">
        <div class="card-body bg-white">
            <asp:HiddenField ID="hfActiveTab" runat="server" Value="Date" />
            <h6 class="fw-bold text-primary mb-3">Report Configuration Filters</h6>
            
            <div class="row g-3 align-items-end">
                <!-- Date Filters (Visible for Date and Percentage Tab) -->
                <asp:Panel ID="pnlDateFilters" runat="server" CssClass="col-md-3">
                    <label for="txtReportDate" class="form-label fw-semibold">Target Date</label>
                    <asp:TextBox ID="txtReportDate" runat="server" CssClass="form-control" TextMode="Date" AutoPostBack="true" OnTextChanged="txtReportDate_TextChanged"></asp:TextBox>
                </asp:Panel>

                <!-- Class Filter (Visible for Date and Percentage Tab) -->
                <asp:Panel ID="pnlClassFilters" runat="server" CssClass="col-md-3">
                    <label for="ddlClassReport" class="form-label fw-semibold">Class / Grade</label>
                    <asp:DropDownList ID="ddlClassReport" runat="server" CssClass="form-select" AutoPostBack="true" OnSelectedIndexChanged="ddlClassReport_SelectedIndexChanged">
                        <asp:ListItem Text="All Classes" Value=""></asp:ListItem>
                        <asp:ListItem Text="Grade 10" Value="Grade 10"></asp:ListItem>
                        <asp:ListItem Text="Grade 11" Value="Grade 11"></asp:ListItem>
                        <asp:ListItem Text="Grade 12" Value="Grade 12"></asp:ListItem>
                    </asp:DropDownList>
                </asp:Panel>

                <!-- Student Filter (Visible for Student Tab only) -->
                <asp:Panel ID="pnlStudentFilters" runat="server" CssClass="col-md-6" Visible="false">
                    <label for="ddlStudentReport" class="form-label fw-semibold">Select Student</label>
                    <asp:DropDownList ID="ddlStudentReport" runat="server" CssClass="form-select" AutoPostBack="true" OnSelectedIndexChanged="ddlStudentReport_SelectedIndexChanged">
                    </asp:DropDownList>
                </asp:Panel>

                <!-- Load Report Button -->
                <div class="col-md-3">
                    <asp:Button ID="btnGenerateReport" runat="server" Text="Generate Report" CssClass="btn btn-primary w-100 fw-bold" OnClick="btnGenerateReport_Click" />
                </div>
            </div>
        </div>
    </div>

    <!-- Print-Only Header (Hidden on screen) -->
    <div class="d-none d-print-block mb-4 text-center">
        <h2 class="fw-bold">AttendancePro - Student Attendance Report</h2>
        <p class="mb-1 text-muted">Generated on <%: DateTime.Now.ToString("f") %></p>
        <p class="fw-bold">
            Report Type: <asp:Label ID="lblPrintReportType" runat="server"></asp:Label> 
            | Parameters: <asp:Label ID="lblPrintParams" runat="server"></asp:Label>
        </p>
        <hr />
    </div>

    <!-- Grid Results Card -->
    <div class="card shadow-sm border-0 bg-white">
        <div class="card-header bg-light py-3 d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold text-dark">
                <asp:Label ID="lblReportTitle" runat="server" Text="Class Attendance Ledger"></asp:Label>
            </h5>
            <span class="text-muted small no-print">
                <i class="bi bi-info-circle me-1"></i> Data loaded via real-time database queries.
            </span>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <!-- Grid A: Attendance By Date -->
                <asp:GridView ID="gvByDate" runat="server" AutoGenerateColumns="False" 
                    CssClass="table table-bordered table-striped table-hover table-custom mb-0 align-middle"
                    EmptyDataText="No records found for the selected date and criteria.">
                    <Columns>
                        <asp:BoundField DataField="RollNumber" HeaderText="Roll No" HeaderStyle-CssClass="ps-4" ItemStyle-CssClass="ps-4 fw-semibold" />
                        <asp:BoundField DataField="FullName" HeaderText="Student Name" />
                        <asp:BoundField DataField="Class" HeaderText="Class" />
                        <asp:BoundField DataField="Section" HeaderText="Section" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center" />
                        <asp:TemplateField HeaderText="Status" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center pe-4">
                            <ItemTemplate>
                                <span class='<%# Convert.ToString(Eval("Status")) == "Present" ? "badge bg-success" : "badge bg-danger" %> px-2.5 py-1.5 fs-7'>
                                    <%# Eval("Status") %>
                                </span>
                            </ItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                </asp:GridView>

                <!-- Grid B: Attendance By Student -->
                <asp:GridView ID="gvByStudent" runat="server" AutoGenerateColumns="False" 
                    CssClass="table table-bordered table-striped table-hover table-custom mb-0 align-middle"
                    EmptyDataText="No historic attendance records found for this student.">
                    <Columns>
                        <asp:BoundField DataField="AttendanceDate" HeaderText="Attendance Date" HeaderStyle-CssClass="ps-4" DataFormatString="{0:MMMM dd, yyyy}" ItemStyle-CssClass="ps-4 fw-semibold" />
                        <asp:BoundField DataField="Class" HeaderText="Class / Grade" />
                        <asp:BoundField DataField="Section" HeaderText="Section" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center" />
                        <asp:TemplateField HeaderText="Recorded Status" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center pe-4">
                            <ItemTemplate>
                                <span class='<%# Convert.ToString(Eval("Status")) == "Present" ? "badge bg-success" : "badge bg-danger" %> px-2.5 py-1.5 fs-7'>
                                    <%# Eval("Status") %>
                                </span>
                            </ItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                </asp:GridView>

                <!-- Grid C: Overall Attendance Percentage Ledger -->
                <asp:GridView ID="gvByPercentage" runat="server" AutoGenerateColumns="False" 
                    CssClass="table table-bordered table-striped table-hover table-custom mb-0 align-middle"
                    EmptyDataText="No data available to calculate rates. Register students and take attendance first.">
                    <Columns>
                        <asp:BoundField DataField="RollNumber" HeaderText="Roll Number" HeaderStyle-CssClass="ps-4" ItemStyle-CssClass="ps-4 fw-semibold" />
                        <asp:BoundField DataField="FullName" HeaderText="Full Name" />
                        <asp:BoundField DataField="Class" HeaderText="Class" />
                        <asp:BoundField DataField="Section" HeaderText="Section" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center" />
                        <asp:BoundField DataField="TotalClasses" HeaderText="Total School Days" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center" />
                        <asp:BoundField DataField="PresentCount" HeaderText="Days Present" HeaderStyle-CssClass="text-center text-success" ItemStyle-CssClass="text-center text-success fw-bold" />
                        <asp:BoundField DataField="AbsentCount" HeaderText="Days Absent" HeaderStyle-CssClass="text-center text-danger" ItemStyle-CssClass="text-center text-danger fw-bold" />
                        <asp:TemplateField HeaderText="Attendance Rate" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center pe-4">
                            <ItemTemplate>
                                <div class="d-flex align-items-center justify-content-center gap-2">
                                    <div class="progress w-50 d-none d-md-flex" style="height: 6px;">
                                        <div class='<%# Convert.ToDouble(Eval("Percentage")) >= 75 ? "progress-bar bg-success" : "progress-bar bg-warning" %>' 
                                             role="progressbar" 
                                             style='<%# "width: " + Eval("Percentage") + "%" %>' 
                                             aria-valuenow='<%# Eval("Percentage") %>' 
                                             aria-valuemin="0" 
                                             aria-valuemax="100">
                                        </div>
                                    </div>
                                    <span class='<%# Convert.ToDouble(Eval("Percentage")) >= 75 ? "text-success fw-bold" : "text-warning fw-bold" %>'>
                                        <%# string.Format("{0:F1}%", Eval("Percentage")) %>
                                    </span>
                                </div>
                            </ItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                </asp:GridView>
            </div>
        </div>
    </div>
</asp:Content>
