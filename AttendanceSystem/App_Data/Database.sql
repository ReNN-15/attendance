-- ==========================================
-- Student Attendance Management System Database Script
-- Compatible with SQL Server (LocalDB) / MSSQL Server
-- ==========================================

-- 1. Create Database if it does not exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'AttendanceDB')
BEGIN
    CREATE DATABASE AttendanceDB;
END
GO

USE AttendanceDB;
GO

-- 2. Drop existing tables if they exist (To allow safe re-runs)
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Attendance_Students')
BEGIN
    ALTER TABLE Attendance DROP CONSTRAINT FK_Attendance_Students;
END
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Attendance')
BEGIN
    DROP TABLE Attendance;
END
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Students')
BEGIN
    DROP TABLE Students;
END
GO

-- 3. Create Students Table
CREATE TABLE Students (
    StudentID INT IDENTITY(1,1) PRIMARY KEY,
    RollNumber NVARCHAR(50) NOT NULL UNIQUE,
    FullName NVARCHAR(150) NOT NULL,
    Class NVARCHAR(50) NOT NULL,
    Section NVARCHAR(50) NOT NULL
);
GO

-- Create Index for fast lookups
CREATE INDEX IX_Students_Class_Section ON Students (Class, Section);
GO

-- 4. Create Attendance Table
CREATE TABLE Attendance (
    AttendanceID INT IDENTITY(1,1) PRIMARY KEY,
    StudentID INT NOT NULL,
    AttendanceDate DATE NOT NULL,
    Status NVARCHAR(10) NOT NULL, -- 'Present' or 'Absent'
    CONSTRAINT FK_Attendance_Students FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE,
    CONSTRAINT UQ_Student_Date UNIQUE (StudentID, AttendanceDate) -- Prevents duplicate attendance for same student on same date
);
GO

-- Create Index for fast attendance lookups by date
CREATE INDEX IX_Attendance_Date ON Attendance (AttendanceDate);
GO

-- 5. Insert Sample Data for testing
INSERT INTO Students (RollNumber, FullName, Class, Section) VALUES
('R001', 'Alex Johnson', 'Grade 10', 'A'),
('R002', 'Bella Smith', 'Grade 10', 'A'),
('R003', 'Charles Davis', 'Grade 10', 'B'),
('R004', 'Diana Miller', 'Grade 10', 'B'),
('R005', 'Ethan Brown', 'Grade 11', 'A'),
('R006', 'Fiona Wilson', 'Grade 11', 'A'),
('R007', 'George Thomas', 'Grade 11', 'B'),
('R008', 'Hannah Garcia', 'Grade 11', 'B'),
('R009', 'Ian Martinez', 'Grade 12', 'A'),
('R010', 'Julia Robinson', 'Grade 12', 'A');
GO

-- Insert historical attendance records for the past 2 days
-- Note: Cast past dates safely
INSERT INTO Attendance (StudentID, AttendanceDate, Status) VALUES
(1, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Present'),
(2, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Present'),
(3, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Absent'),
(4, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Present'),
(5, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Present'),
(6, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Absent'),
(7, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Present'),
(8, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Present'),
(9, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Present'),
(10, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Absent');

INSERT INTO Attendance (StudentID, AttendanceDate, Status) VALUES
(1, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'Present'),
(2, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'Absent'),
(3, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'Present'),
(4, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'Present'),
(5, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'Present'),
(6, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'Present'),
(7, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'Absent'),
(8, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'Present'),
(9, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'Present'),
(10, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'Present');
GO
