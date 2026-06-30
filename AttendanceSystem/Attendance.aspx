<%@ Page Title="Attendance" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Attendance.aspx.cs" Inherits="AttendanceSystem.Attendance" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row mb-4">
        <div class="col-12 d-flex justify-content-between align-items-center">
            <div>
                <h1 class="h2 text-gray-900 font-sans font-medium tracking-tight">Record Attendance</h1>
                <p class="text-muted">Select a date and class to record or update attendance sheets.</p>
            </div>
            <div>
                <asp:Label ID="lblMessage" runat="server" CssClass="fw-bold"></asp:Label>
            </div>
        </div>
    </div>

    <!-- Configuration Panel -->
    <div class="card shadow-sm border-0 mb-4">
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <!-- Date Picker -->
                <div class="col-md-3">
                    <label for="txtDate" class="form-label fw-semibold">Attendance Date <span class="text-danger">*</span></label>
                    <asp:TextBox ID="txtDate" runat="server" CssClass="form-control" TextMode="Date" AutoPostBack="true" OnTextChanged="txtDate_TextChanged"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="rfvDate" runat="server" ControlToValidate="txtDate" 
                        ErrorMessage="Select a date." CssClass="text-danger small mt-1 d-block" 
                        ValidationGroup="FilterGroup"></asp:RequiredFieldValidator>
                </div>

                <!-- Class Dropdown -->
                <div class="col-md-3">
                    <label for="ddlClassFilter" class="form-label fw-semibold">Select Class <span class="text-danger">*</span></label>
                    <asp:DropDownList ID="ddlClassFilter" runat="server" CssClass="form-select" AutoPostBack="true" OnSelectedIndexChanged="ddlClassFilter_SelectedIndexChanged">
                        <asp:ListItem Text="Select Class" Value=""></asp:ListItem>
                        <asp:ListItem Text="Grade 10" Value="Grade 10"></asp:ListItem>
                        <asp:ListItem Text="Grade 11" Value="Grade 11"></asp:ListItem>
                        <asp:ListItem Text="Grade 12" Value="Grade 12"></asp:ListItem>
                    </asp:DropDownList>
                    <asp:RequiredFieldValidator ID="rfvClassFilter" runat="server" ControlToValidate="ddlClassFilter" 
                        InitialValue="" ErrorMessage="Select a class." CssClass="text-danger small mt-1 d-block" 
                        ValidationGroup="FilterGroup"></asp:RequiredFieldValidator>
                </div>

                <!-- Load Sheet Button -->
                <div class="col-md-3">
                    <asp:Button ID="btnLoadSheet" runat="server" Text="Load Attendance Sheet" CssClass="btn btn-primary w-100 fw-bold" 
                        ValidationGroup="FilterGroup" OnClick="btnLoadSheet_Click" />
                </div>

                <!-- Quick Actions (Mark All Present/Absent) -->
                <div class="col-md-3 text-md-end" id="divQuickActions" runat="server" visible="false">
                    <div class="btn-group" role="group">
                        <asp:Button ID="btnMarkAllPresent" runat="server" Text="Mark All Present" CssClass="btn btn-sm btn-outline-success" OnClick="btnMarkAllPresent_Click" CausesValidation="false" />
                        <asp:Button ID="btnMarkAllAbsent" runat="server" Text="Mark All Absent" CssClass="btn btn-sm btn-outline-danger" OnClick="btnMarkAllAbsent_Click" CausesValidation="false" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Attendance Sheet Grid -->
    <asp:Panel ID="pnlAttendanceSheet" runat="server" Visible="false">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold text-primary">
                    Attendance Sheet for <asp:Label ID="lblCurrentClass" runat="server" CssClass="text-dark"></asp:Label> 
                    on <asp:Label ID="lblCurrentDate" runat="server" CssClass="text-dark"></asp:Label>
                </h5>
                <asp:Label ID="lblSheetStatus" runat="server" CssClass="badge bg-warning text-dark px-2 py-1"></asp:Label>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <asp:GridView ID="gvAttendanceSheet" runat="server" AutoGenerateColumns="False" 
                        CssClass="table table-hover table-custom mb-0 align-middle" 
                        DataKeyNames="StudentID">
                        <Columns>
                            <asp:BoundField DataField="RollNumber" HeaderText="Roll Number" HeaderStyle-CssClass="ps-4" ItemStyle-CssClass="ps-4 fw-semibold" />
                            <asp:BoundField DataField="FullName" HeaderText="Student Full Name" />
                            <asp:BoundField DataField="Section" HeaderText="Section" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center" />
                            
                            <asp:TemplateField HeaderText="Attendance Status" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center py-2">
                                <ItemTemplate>
                                    <div class="d-flex justify-content-center gap-3">
                                        <!-- Present Option -->
                                        <div class="form-check form-check-inline mb-0">
                                            <input type="radio" 
                                                   id='<%# "p_" + Eval("StudentID") %>' 
                                                   name='<%# "status_" + Eval("StudentID") %>' 
                                                   value="Present" 
                                                   class="form-check-input" 
                                                   <%# Convert.ToString(Eval("Status")) == "Present" ? "checked" : "" %> />
                                            <label class="form-check-label text-success fw-semibold" for='<%# "p_" + Eval("StudentID") %>'>
                                                <i class="bi bi-check-circle-fill me-1"></i> Present
                                            </label>
                                        </div>
                                        <!-- Absent Option -->
                                        <div class="form-check form-check-inline mb-0">
                                            <input type="radio" 
                                                   id='<%# "a_" + Eval("StudentID") %>' 
                                                   name='<%# "status_" + Eval("StudentID") %>' 
                                                   value="Absent" 
                                                   class="form-check-input" 
                                                   <%# Convert.ToString(Eval("Status")) == "Absent" ? "checked" : "" %> />
                                            <label class="form-check-label text-danger fw-semibold" for='<%# "a_" + Eval("StudentID") %>'>
                                                <i class="bi bi-x-circle-fill me-1"></i> Absent
                                            </label>
                                        </div>
                                    </div>
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </asp:GridView>
                </div>
            </div>
            <div class="card-footer bg-light d-flex justify-content-between py-3">
                <span class="text-muted small d-flex align-items-center">
                    <i class="bi bi-info-circle me-1 text-primary"></i> Review status selections carefully before saving.
                </span>
                <asp:Button ID="btnSaveAttendance" runat="server" Text="Save Attendance Sheet" CssClass="btn btn-success px-4 fw-bold" OnClick="btnSaveAttendance_Click" />
            </div>
        </div>
    </asp:Panel>

    <!-- Empty State helper when sheet isn't loaded -->
    <asp:Panel ID="pnlEmptyState" runat="server">
        <div class="card border-0 shadow-sm py-5 text-center bg-white">
            <div class="card-body">
                <i class="bi bi-calendar-range text-muted fs-1 opacity-50 mb-3 d-block"></i>
                <h5 class="text-secondary">Attendance Sheet Pending</h5>
                <p class="text-muted max-w-sm mx-auto small">Please select a valid Class and Date from the panel above, and click 'Load Attendance Sheet' to start recording records.</p>
            </div>
        </div>
    </asp:Panel>
</asp:Content>
