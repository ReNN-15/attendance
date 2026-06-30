<%@ Page Title="Dashboard" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="AttendanceSystem.Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row mb-4">
        <div class="col-12">
            <h1 class="h2 text-gray-900 font-sans font-medium tracking-tight">Dashboard</h1>
            <p class="text-muted">Welcome to the Student Attendance Management System. Here is today's overview.</p>
        </div>
    </div>

    <!-- Stats Cards Row -->
    <div class="row g-4 mb-4">
        <!-- Total Students -->
        <div class="col-xl-3 col-md-6">
            <div class="card card-stats border-start border-primary border-4 h-100 shadow-sm">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Students</div>
                            <div class="h2 mb-0 fw-bold">
                                <asp:Label ID="lblTotalStudents" runat="server" Text="0"></asp:Label>
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="bi bi-people-fill text-muted fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Present Today -->
        <div class="col-xl-3 col-md-6">
            <div class="card card-stats border-start border-success border-4 h-100 shadow-sm">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Present Today</div>
                            <div class="h2 mb-0 fw-bold text-success">
                                <asp:Label ID="lblPresentToday" runat="server" Text="0"></asp:Label>
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="bi bi-check-circle-fill text-muted fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Absent Today -->
        <div class="col-xl-3 col-md-6">
            <div class="card card-stats border-start border-danger border-4 h-100 shadow-sm">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col">
                            <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">Absent Today</div>
                            <div class="h2 mb-0 fw-bold text-danger">
                                <asp:Label ID="lblAbsentToday" runat="server" Text="0"></asp:Label>
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="bi bi-x-circle-fill text-muted fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Attendance Percentage -->
        <div class="col-xl-3 col-md-6">
            <div class="card card-stats border-start border-info border-4 h-100 shadow-sm">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Attendance Rate</div>
                            <div class="h2 mb-0 fw-bold text-info">
                                <asp:Label ID="lblAttendancePercentage" runat="server" Text="0%"></asp:Label>
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="bi bi-percent text-muted fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Links & Actions -->
    <div class="row g-4">
        <!-- Quick Tasks -->
        <div class="col-lg-6">
            <div class="card shadow-sm h-100">
                <div class="card-header bg-white py-3">
                    <h6 class="m-0 fw-bold text-primary">Quick Navigation</h6>
                </div>
                <div class="card-body">
                    <p class="text-muted small">Manage records or take attendance for classes quickly from here.</p>
                    <div class="d-grid gap-3">
                        <a href="Attendance.aspx" class="btn btn-outline-primary d-flex align-items-center justify-content-between p-3 text-start">
                            <span>
                                <i class="bi bi-calendar-check me-2 fs-5"></i>
                                <strong>Take Daily Attendance</strong>
                                <span class="d-block text-muted small">Record present/absent students for today.</span>
                            </span>
                            <i class="bi bi-arrow-right"></i>
                        </a>
                        <a href="Students.aspx" class="btn btn-outline-primary d-flex align-items-center justify-content-between p-3 text-start">
                            <span>
                                <i class="bi bi-person-plus me-2 fs-5"></i>
                                <strong>Manage Students</strong>
                                <span class="d-block text-muted small">Add, update, search, or remove student profiles.</span>
                            </span>
                            <i class="bi bi-arrow-right"></i>
                        </a>
                        <a href="Reports.aspx" class="btn btn-outline-primary d-flex align-items-center justify-content-between p-3 text-start">
                            <span>
                                <i class="bi bi-file-earmark-bar-graph me-2 fs-5"></i>
                                <strong>Generate Reports</strong>
                                <span class="d-block text-muted small">Print or export attendance summaries and history.</span>
                            </span>
                            <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Today's Attendance Logs / System Info -->
        <div class="col-lg-6">
            <div class="card shadow-sm h-100">
                <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h6 class="m-0 fw-bold text-primary">Class-wise Overview (Today)</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <asp:GridView ID="gvClassSummary" runat="server" AutoGenerateColumns="False" 
                            CssClass="table table-bordered table-striped table-hover table-custom" 
                            EmptyDataText="No attendance has been taken for today yet.">
                            <Columns>
                                <asp:BoundField DataField="Class" HeaderText="Class / Grade" />
                                <asp:BoundField DataField="Total" HeaderText="Students Registered" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center" />
                                <asp:BoundField DataField="Present" HeaderText="Present" HeaderStyle-CssClass="text-center text-success" ItemStyle-CssClass="text-center text-success fw-bold" />
                                <asp:BoundField DataField="Absent" HeaderText="Absent" HeaderStyle-CssClass="text-center text-danger" ItemStyle-CssClass="text-center text-danger fw-bold" />
                                <asp:BoundField DataField="Rate" HeaderText="Attendance %" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center fw-bold text-info" />
                            </Columns>
                        </asp:GridView>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
