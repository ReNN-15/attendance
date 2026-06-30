<%@ Page Title="Students" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Students.aspx.cs" Inherits="AttendanceSystem.Students" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row mb-4">
        <div class="col-12 d-flex justify-content-between align-items-center">
            <div>
                <h1 class="h2 text-gray-900 font-sans font-medium tracking-tight">Student Directory</h1>
                <p class="text-muted">Manage student records, perform searches, add new enrollments, and update details.</p>
            </div>
            <div>
                <asp:Label ID="lblStatusMessage" runat="server" CssClass="fw-bold"></asp:Label>
            </div>
        </div>
    </div>

    <div class="row g-4">
        <!-- Add/Edit Form Column -->
        <div class="col-lg-4">
            <div class="card shadow-sm border-0">
                <div class="card-header bg-primary text-white py-3">
                    <h5 class="card-title mb-0 fw-bold">
                        <asp:Label ID="lblFormTitle" runat="server" Text="Add New Student"></asp:Label>
                    </h5>
                </div>
                <div class="card-body">
                    <!-- Student ID Hidden Field (for updates) -->
                    <asp:HiddenField ID="hfStudentID" runat="server" />

                    <!-- Roll Number -->
                    <div class="mb-3">
                        <label for="txtRollNumber" class="form-label fw-semibold">Roll Number <span class="text-danger">*</span></label>
                        <asp:TextBox ID="txtRollNumber" runat="server" CssClass="form-class form-control" placeholder="e.g., R101"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvRollNumber" runat="server" ControlToValidate="txtRollNumber" 
                            ErrorMessage="Roll number is required." CssClass="text-danger small d-block mt-1" 
                            ValidationGroup="StudentForm"></asp:RequiredFieldValidator>
                    </div>

                    <!-- Full Name -->
                    <div class="mb-3">
                        <label for="txtFullName" class="form-label fw-semibold">Full Name <span class="text-danger">*</span></label>
                        <asp:TextBox ID="txtFullName" runat="server" CssClass="form-control" placeholder="e.g., John Doe"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvFullName" runat="server" ControlToValidate="txtFullName" 
                            ErrorMessage="Full name is required." CssClass="text-danger small d-block mt-1" 
                            ValidationGroup="StudentForm"></asp:RequiredFieldValidator>
                    </div>

                    <!-- Class/Grade -->
                    <div class="mb-3">
                        <label for="ddlClass" class="form-label fw-semibold">Class / Grade <span class="text-danger">*</span></label>
                        <asp:DropDownList ID="ddlClass" runat="server" CssClass="form-select">
                            <asp:ListItem Text="Select Class" Value=""></asp:ListItem>
                            <asp:ListItem Text="Grade 10" Value="Grade 10"></asp:ListItem>
                            <asp:ListItem Text="Grade 11" Value="Grade 11"></asp:ListItem>
                            <asp:ListItem Text="Grade 12" Value="Grade 12"></asp:ListItem>
                        </asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfvClass" runat="server" ControlToValidate="ddlClass" 
                            InitialValue="" ErrorMessage="Please select a class." CssClass="text-danger small d-block mt-1" 
                            ValidationGroup="StudentForm"></asp:RequiredFieldValidator>
                    </div>

                    <!-- Section -->
                    <div class="mb-3">
                        <label for="ddlSection" class="form-label fw-semibold">Section <span class="text-danger">*</span></label>
                        <asp:DropDownList ID="ddlSection" runat="server" CssClass="form-select">
                            <asp:ListItem Text="Select Section" Value=""></asp:ListItem>
                            <asp:ListItem Text="A" Value="A"></asp:ListItem>
                            <asp:ListItem Text="B" Value="B"></asp:ListItem>
                            <asp:ListItem Text="C" Value="C"></asp:ListItem>
                        </asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfvSection" runat="server" ControlToValidate="ddlSection" 
                            InitialValue="" ErrorMessage="Please select a section." CssClass="text-danger small d-block mt-1" 
                            ValidationGroup="StudentForm"></asp:RequiredFieldValidator>
                    </div>

                    <!-- Action Buttons -->
                    <div class="d-grid gap-2">
                        <asp:Button ID="btnSave" runat="server" Text="Save Student" CssClass="btn btn-primary fw-bold" 
                            ValidationGroup="StudentForm" OnClick="btnSave_Click" />
                        <asp:Button ID="btnCancel" runat="server" Text="Cancel" CssClass="btn btn-secondary" 
                            Visible="false" OnClick="btnCancel_Click" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Student GridView & Search Column -->
        <div class="col-lg-8">
            <div class="card shadow-sm border-0">
                <div class="card-header bg-white py-3">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h5 class="mb-0 fw-bold text-primary">All Registered Students</h5>
                        </div>
                        <div class="col-md-6 mt-2 mt-md-0">
                            <div class="input-group">
                                <asp:TextBox ID="txtSearch" runat="server" CssClass="form-control" placeholder="Search by Roll No or Name..."></asp:TextBox>
                                <asp:Button ID="btnSearch" runat="server" Text="Search" CssClass="btn btn-outline-primary" OnClick="btnSearch_Click" />
                                <asp:Button ID="btnClearSearch" runat="server" Text="Reset" CssClass="btn btn-outline-secondary" OnClick="btnClearSearch_Click" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <asp:GridView ID="gvStudents" runat="server" AutoGenerateColumns="False" 
                            CssClass="table table-striped table-hover table-custom mb-0 align-middle" 
                            DataKeyNames="StudentID" 
                            OnRowEditing="gvStudents_RowEditing" 
                            OnRowDeleting="gvStudents_RowDeleting"
                            EmptyDataText="No students found matching the criteria.">
                            <Columns>
                                <asp:BoundField DataField="RollNumber" HeaderText="Roll Number" HeaderStyle-CssClass="ps-3" ItemStyle-CssClass="ps-3 fw-semibold" />
                                <asp:BoundField DataField="FullName" HeaderText="Full Name" />
                                <asp:BoundField DataField="Class" HeaderText="Class / Grade" />
                                <asp:BoundField DataField="Section" HeaderText="Section" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center" />
                                <asp:TemplateField HeaderText="Actions" HeaderStyle-CssClass="text-center" ItemStyle-CssClass="text-center pe-3">
                                    <ItemTemplate>
                                        <asp:LinkButton ID="btnEdit" runat="server" CommandName="Edit" CssClass="btn btn-sm btn-outline-primary me-1" CausesValidation="false">
                                            <i class="bi bi-pencil"></i> Edit
                                        </asp:LinkButton>
                                        <asp:LinkButton ID="btnDelete" runat="server" CommandName="Delete" CssClass="btn btn-sm btn-outline-danger" 
                                            OnClientClick="return confirm('Are you sure you want to delete this student profile? This will also delete their attendance records.');" 
                                            CausesValidation="false">
                                            <i class="bi bi-trash"></i> Delete
                                        </asp:LinkButton>
                                    </ItemTemplate>
                                </asp:TemplateField>
                            </Columns>
                        </asp:GridView>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
