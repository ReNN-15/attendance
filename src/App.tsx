import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Percent, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  FileSpreadsheet, 
  Printer, 
  Folder, 
  FileCode, 
  Copy, 
  Download, 
  MonitorPlay, 
  Code, 
  Sparkles,
  Info,
  ChevronRight,
  Database,
  ArrowRight
} from "lucide-react";
import { sourceFiles, SourceFile } from "./data/sourceFiles";

// --- Types ---
interface Student {
  id: number;
  rollNumber: string;
  fullName: string;
  classVal: string;
  sectionVal: string;
}

interface AttendanceRecord {
  id: string; // studentId_dateString
  studentId: number;
  date: string; // yyyy-MM-dd
  status: "Present" | "Absent";
}

// --- Preloaded Initial State (Matching SQL script) ---
const initialStudents: Student[] = [
  { id: 1, rollNumber: "R001", fullName: "Alex Johnson", classVal: "Grade 10", sectionVal: "A" },
  { id: 2, rollNumber: "R002", fullName: "Bella Smith", classVal: "Grade 10", sectionVal: "A" },
  { id: 3, rollNumber: "R003", fullName: "Charles Davis", classVal: "Grade 10", sectionVal: "B" },
  { id: 4, rollNumber: "R004", fullName: "Diana Miller", classVal: "Grade 10", sectionVal: "B" },
  { id: 5, rollNumber: "R005", fullName: "Ethan Brown", classVal: "Grade 11", sectionVal: "A" },
  { id: 6, rollNumber: "R006", fullName: "Fiona Wilson", classVal: "Grade 11", sectionVal: "A" },
  { id: 7, rollNumber: "R007", fullName: "George Thomas", classVal: "Grade 11", sectionVal: "B" },
  { id: 8, rollNumber: "R008", fullName: "Hannah Garcia", classVal: "Grade 11", sectionVal: "B" },
  { id: 9, rollNumber: "R009", fullName: "Ian Martinez", classVal: "Grade 12", sectionVal: "A" },
  { id: 10, rollNumber: "R010", fullName: "Julia Robinson", classVal: "Grade 12", sectionVal: "A" },
];

const initialAttendance: AttendanceRecord[] = [
  // 2 days ago (June 28, 2026)
  { id: "1_2026-06-28", studentId: 1, date: "2026-06-28", status: "Present" },
  { id: "2_2026-06-28", studentId: 2, date: "2026-06-28", status: "Present" },
  { id: "3_2026-06-28", studentId: 3, date: "2026-06-28", status: "Absent" },
  { id: "4_2026-06-28", studentId: 4, date: "2026-06-28", status: "Present" },
  { id: "5_2026-06-28", studentId: 5, date: "2026-06-28", status: "Present" },
  { id: "6_2026-06-28", studentId: 6, date: "2026-06-28", status: "Absent" },
  { id: "7_2026-06-28", studentId: 7, date: "2026-06-28", status: "Present" },
  { id: "8_2026-06-28", studentId: 8, date: "2026-06-28", status: "Present" },
  { id: "9_2026-06-28", studentId: 9, date: "2026-06-28", status: "Present" },
  { id: "10_2026-06-28", studentId: 10, date: "2026-06-28", status: "Absent" },
  // 1 day ago (June 29, 2026)
  { id: "1_2026-06-29", studentId: 1, date: "2026-06-29", status: "Present" },
  { id: "2_2026-06-29", studentId: 2, date: "2026-06-29", status: "Absent" },
  { id: "3_2026-06-29", studentId: 3, date: "2026-06-29", status: "Present" },
  { id: "4_2026-06-29", studentId: 4, date: "2026-06-29", status: "Present" },
  { id: "5_2026-06-29", studentId: 5, date: "2026-06-29", status: "Present" },
  { id: "6_2026-06-29", studentId: 6, date: "2026-06-29", status: "Present" },
  { id: "7_2026-06-29", studentId: 7, date: "2026-06-29", status: "Absent" },
  { id: "8_2026-06-29", studentId: 8, date: "2026-06-29", status: "Present" },
  { id: "9_2026-06-29", studentId: 9, date: "2026-06-29", status: "Present" },
  { id: "10_2026-06-29", studentId: 10, date: "2026-06-29", status: "Present" },
];

export default function App() {
  // --- Overall Mode Tab ---
  // "preview" (interactive simulator) OR "code" (visual studio project explorer)
  const [appMode, setAppMode] = useState<"preview" | "code">("preview");

  // --- Database States (Backed up in LocalStorage for dynamic feel) ---
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("asp_students");
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem("asp_attendance");
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  useEffect(() => {
    localStorage.setItem("asp_students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("asp_attendance", JSON.stringify(attendance));
  }, [attendance]);

  // --- Interactive Preview Sub-navigation ---
  // Matches ASP.NET Master Page: "dashboard" | "students" | "attendance" | "reports"
  const [activePage, setActivePage] = useState<"dashboard" | "students" | "attendance" | "reports">("dashboard");

  // --- Sub-States for Each Page ---

  // A. Student Management Form States
  const [studentFormId, setStudentFormId] = useState<number | null>(null); // null = Add, number = Edit
  const [txtRollNumber, setTxtRollNumber] = useState("");
  const [txtFullName, setTxtFullName] = useState("");
  const [ddlClass, setDdlClass] = useState("");
  const [ddlSection, setDdlSection] = useState("");
  const [studentSearchKeyword, setStudentSearchKeyword] = useState("");
  const [studentFormError, setStudentFormError] = useState("");
  const [studentSuccessMessage, setStudentSuccessMessage] = useState("");

  // B. Attendance Recording States
  const [txtAttendanceDate, setTxtAttendanceDate] = useState(() => {
    // Default to current local date
    return new Date().toISOString().split("T")[0];
  });
  const [ddlClassFilter, setDdlClassFilter] = useState("Grade 10");
  const [sheetLoaded, setSheetLoaded] = useState(false);
  // Temporary session-state for current loaded attendance sheet
  const [currentSheetRecords, setCurrentSheetRecords] = useState<{ studentId: number; status: "Present" | "Absent" }[]>([]);
  const [attendanceStatusMessage, setAttendanceStatusMessage] = useState("");

  // C. Reports States
  const [reportsTab, setReportsTab] = useState<"date" | "student" | "percentage">("date");
  const [txtReportDate, setTxtReportDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [ddlClassReport, setDdlClassReport] = useState("");
  const [ddlStudentReport, setDdlStudentReport] = useState("");

  // D. Code Explorer States
  const [selectedFile, setSelectedFile] = useState<SourceFile>(sourceFiles[0]);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // --- Interactive Logic handlers ---

  // 1. Student Add / Edit Form Save
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentFormError("");
    setStudentSuccessMessage("");

    if (!txtRollNumber.trim()) {
      setStudentFormError("Roll number is required.");
      return;
    }
    if (!txtFullName.trim()) {
      setStudentFormError("Full name is required.");
      return;
    }
    if (!ddlClass) {
      setStudentFormError("Please select a class.");
      return;
    }
    if (!ddlSection) {
      setStudentFormError("Please select a section.");
      return;
    }

    const uppercaseRoll = txtRollNumber.trim().toUpperCase();

    // Duplicate check
    const duplicate = students.find(
      (s) => s.rollNumber.toUpperCase() === uppercaseRoll && s.id !== studentFormId
    );
    if (duplicate) {
      setStudentFormError(`Roll number '${uppercaseRoll}' is already registered to ${duplicate.fullName}.`);
      return;
    }

    if (studentFormId === null) {
      // Add
      const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
      const newStudent: Student = {
        id: newId,
        rollNumber: uppercaseRoll,
        fullName: txtFullName.trim(),
        classVal: ddlClass,
        sectionVal: ddlSection
      };
      setStudents([...students, newStudent]);
      setStudentSuccessMessage(`Student profile '${newStudent.fullName}' registered successfully!`);
    } else {
      // Edit
      setStudents(
        students.map((s) =>
          s.id === studentFormId
            ? { ...s, rollNumber: uppercaseRoll, fullName: txtFullName.trim(), classVal: ddlClass, sectionVal: ddlSection }
            : s
        )
      );
      setStudentSuccessMessage("Student profile updated successfully!");
    }

    // Reset Form
    handleClearStudentForm();
  };

  const handleEditStudentClick = (student: Student) => {
    setStudentFormId(student.id);
    setTxtRollNumber(student.rollNumber);
    setTxtFullName(student.fullName);
    setDdlClass(student.classVal);
    setDdlSection(student.sectionVal);
    setStudentFormError("");
    setStudentSuccessMessage("");
  };

  const handleDeleteStudentClick = (id: number) => {
    const student = students.find((s) => s.id === id);
    if (window.confirm(`Are you sure you want to delete '${student?.fullName}'? This will cascadingly remove all their historical attendance records.`)) {
      setStudents(students.filter((s) => s.id !== id));
      setAttendance(attendance.filter((a) => a.studentId !== id));
      setStudentSuccessMessage("Student and historic records deleted successfully.");
      if (studentFormId === id) {
        handleClearStudentForm();
      }
    }
  };

  const handleClearStudentForm = () => {
    setStudentFormId(null);
    setTxtRollNumber("");
    setTxtFullName("");
    setDdlClass("");
    setDdlSection("");
  };

  // 2. Attendance Recording handlers
  const handleLoadSheet = () => {
    if (!txtAttendanceDate) {
      alert("Please select a valid date.");
      return;
    }
    if (!ddlClassFilter) {
      alert("Please select a class.");
      return;
    }

    // Load registered students of this class
    const classStudents = students.filter((s) => s.classVal === ddlClassFilter);
    if (classStudents.length === 0) {
      alert(`No registered students found in ${ddlClassFilter}. Please register students first.`);
      setSheetLoaded(false);
      return;
    }

    // Retrieve existing attendance records for this date
    const sheetDate = txtAttendanceDate;
    const records = classStudents.map((student) => {
      const existing = attendance.find(
        (a) => a.studentId === student.id && a.date === sheetDate
      );
      return {
        studentId: student.id,
        status: existing ? existing.status : ("Present" as const) // default to Present
      };
    });

    setCurrentSheetRecords(records);
    setSheetLoaded(true);
    setAttendanceStatusMessage("");
  };

  const handleStatusChangeInSheet = (studentId: number, status: "Present" | "Absent") => {
    setCurrentSheetRecords(
      currentSheetRecords.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  };

  const handleMarkAllSheet = (status: "Present" | "Absent") => {
    setCurrentSheetRecords(currentSheetRecords.map((r) => ({ ...r, status })));
    setAttendanceStatusMessage(`Temporary state: marked all '${status}'. Click Save to write records.`);
  };

  const handleSaveAttendanceSheet = () => {
    // Push current loaded sheet records back into the central attendance database state
    const otherRecords = attendance.filter(
      (a) =>
        !(
          a.date === txtAttendanceDate &&
          students.find((s) => s.id === a.studentId)?.classVal === ddlClassFilter
        )
    );

    const savedRecords: AttendanceRecord[] = currentSheetRecords.map((r) => ({
      id: `${r.studentId}_${txtAttendanceDate}`,
      studentId: r.studentId,
      date: txtAttendanceDate,
      status: r.status
    }));

    setAttendance([...otherRecords, ...savedRecords]);
    setAttendanceStatusMessage(`ASP.NET GridView updated! Saved ${savedRecords.length} records successfully.`);
    // Re-load
    handleLoadSheet();
  };

  // 3. Export Active Report to CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (reportsTab === "date") {
      csvContent += "Roll Number,Full Name,Class,Section,Status\r\n";
      const records = students.map((s) => {
        const record = attendance.find((a) => a.studentId === s.id && a.date === txtReportDate);
        return {
          roll: s.rollNumber,
          name: s.fullName,
          class: s.classVal,
          section: s.sectionVal,
          status: record ? record.status : "No Record"
        };
      }).filter((s) => !ddlClassReport || s.class === ddlClassReport);

      records.forEach((r) => {
        csvContent += `"${r.roll}","${r.name}","${r.class}","${r.section}","${r.status}"\r\n`;
      });
    } else if (reportsTab === "student") {
      csvContent += "Date,Class,Section,Status\r\n";
      const selectedId = Number(ddlStudentReport);
      const records = attendance
        .filter((a) => a.studentId === selectedId)
        .sort((a, b) => b.date.localeCompare(a.date));

      const s = students.find((st) => st.id === selectedId);
      records.forEach((r) => {
        csvContent += `"${r.date}","${s?.classVal}","${s?.sectionVal}","${r.status}"\r\n`;
      });
    } else {
      csvContent += "Roll Number,Full Name,Class,Section,Total School Days,Days Present,Days Absent,Attendance Rate\r\n";
      const records = students
        .filter((s) => !ddlClassReport || s.classVal === ddlClassReport)
        .map((s) => {
          const studentHistory = attendance.filter((a) => a.studentId === s.id);
          const totalDays = studentHistory.length;
          const presentCount = studentHistory.filter((a) => a.status === "Present").length;
          const absentCount = studentHistory.filter((a) => a.status === "Absent").length;
          const percentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 100;
          return {
            roll: s.rollNumber,
            name: s.fullName,
            class: s.classVal,
            section: s.sectionVal,
            totalDays,
            presentCount,
            absentCount,
            percentage: percentage.toFixed(1) + "%"
          };
        });

      records.forEach((r) => {
        csvContent += `"${r.roll}","${r.name}","${r.class}","${r.section}","${r.totalDays}","${r.presentCount}","${r.absentCount}","${r.percentage}"\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AttendanceReport_${reportsTab}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Code to Clipboard helper
  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Download complete project ZIP placeholder explanation helper
  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedFile.filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // --- Real-time statistics calculators for Dashboard ---
  const totalStudentsCount = students.length;
  // Get counts for "Today" (We simulate today's stats based on currently selected date or current system date records)
  const todayDateStr = new Date().toISOString().split("T")[0];
  const presentTodayCount = attendance.filter((a) => a.date === todayDateStr && a.status === "Present").length;
  const absentTodayCount = attendance.filter((a) => a.date === todayDateStr && a.status === "Absent").length;
  const totalTodayRecords = presentTodayCount + absentTodayCount;
  const attendanceRateToday = totalTodayRecords > 0 ? ((presentTodayCount / totalTodayRecords) * 100).toFixed(1) + "%" : "0.0%";

  // Class wise summaries
  const classesList = ["Grade 10", "Grade 11", "Grade 12"];
  const classOverviewData = classesList.map((cls) => {
    const classSts = students.filter((s) => s.classVal === cls);
    const totalReg = classSts.length;
    const presentToday = attendance.filter(
      (a) => a.date === todayDateStr && a.status === "Present" && classSts.find((s) => s.id === a.studentId)
    ).length;
    const absentToday = attendance.filter(
      (a) => a.date === todayDateStr && a.status === "Absent" && classSts.find((s) => s.id === a.studentId)
    ).length;
    const rate = (presentToday + absentToday) > 0 ? ((presentToday / (presentToday + absentToday)) * 100).toFixed(1) + "%" : "N/A";
    return {
      className: cls,
      totalReg,
      presentToday,
      absentToday,
      rate
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Top Banner - Interactive Mode Toggle */}
      <div className="bg-[#1e293b] text-white py-2 px-4 flex flex-wrap justify-between items-center gap-2 border-b border-slate-700 no-print">
        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-300">
          <Database className="w-4 h-4 text-sky-400" />
          <span>ASP.NET Web Forms Student System Simulator (VS 2026 Compatible)</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900 rounded-lg p-1 border border-slate-700">
          <button
            onClick={() => setAppMode("preview")}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              appMode === "preview" 
                ? "bg-blue-600 text-white" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            Live Preview (Interactive)
          </button>
          <button
            onClick={() => setAppMode("code")}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              appMode === "code" 
                ? "bg-blue-600 text-white" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Visual Studio Code Explorer
          </button>
        </div>
      </div>

      {/* Main Body */}
      {appMode === "preview" ? (
        // ==========================================
        // MOCKUP OF THE ASP.NET WEB FORMS SYSTEM
        // ==========================================
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Left Sidebar Navigation */}
          <aside className="w-full md:w-64 bg-blue-900 flex flex-col no-print shrink-0 border-r border-blue-950">
            <div className="p-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-900 font-extrabold text-xl shadow-md font-sans">
                AP
              </div>
              <div className="text-white">
                <h1 className="text-sm font-bold tracking-tight uppercase">AttendancePro</h1>
                <p className="text-[10px] opacity-60">v2026 Enterprise</p>
              </div>
            </div>
            
            <nav className="mt-4 flex-1 space-y-1 px-3">
              {[
                { id: "dashboard", label: "Dashboard", count: null, icon: CheckCircle },
                { id: "students", label: "Students", count: students.length, icon: Users },
                { id: "attendance", label: "Attendance", count: null, icon: Calendar },
                { id: "reports", label: "Reports", count: null, icon: FileSpreadsheet }
              ].map((p) => {
                const IconComponent = p.icon;
                const isActive = activePage === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePage(p.id as any);
                      setStudentSuccessMessage("");
                      setStudentFormError("");
                      setAttendanceStatusMessage("");
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-blue-800 text-white shadow-sm" 
                        : "text-blue-200 hover:bg-blue-800/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5" />
                      <span>{p.label}</span>
                    </div>
                    {p.count !== null && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-blue-950 rounded-full text-blue-200 font-bold">
                        {p.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            
            <div className="p-6 border-t border-blue-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                  AU
                </div>
                <div className="overflow-hidden text-left">
                  <p className="text-xs font-bold text-white truncate">Admin User</p>
                  <p className="text-[10px] text-blue-300 truncate">admin@attendance.edu</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
            {/* Top Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 shadow-sm no-print">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-800 uppercase tracking-tight">
                  {activePage === "dashboard" && "System Dashboard"}
                  {activePage === "students" && "Student Directory"}
                  {activePage === "attendance" && "Attendance Ledger"}
                  {activePage === "reports" && "Reports & Analytics"}
                </h2>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                  Live
                </span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Current Date</p>
                  <p className="text-xs font-semibold text-slate-700">{todayDateStr}</p>
                </div>
                {activePage !== "attendance" && (
                  <button 
                    onClick={() => setActivePage("attendance")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    + Quick Attendance
                  </button>
                )}
              </div>
            </header>

            {/* Simulated LocalDB Notification banner */}
            <div className="bg-sky-50/50 border-b border-sky-100/50 py-2.5 px-6 sm:px-8 no-print">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-sky-800">
                <div className="flex items-center gap-1.5 font-medium">
                  <Info className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Simulating database records stored on client local state. SQL Server compliant.</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="px-1.5 py-0.2 bg-sky-200 text-sky-900 rounded font-bold">LOCALDB ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Main scrollable page content */}
            <main className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
              <AnimatePresence mode="wait">
              {activePage === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500">Real-time attendance summaries, database records counters, and operations hub.</p>
                  </div>

                  {/* 4 Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Registered Students */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Students</span>
                        <p className="text-3xl font-bold text-slate-800 mt-1">{totalStudentsCount}</p>
                      </div>
                      <div className="mt-2 flex items-center text-green-600 text-[10px] font-bold gap-1">
                        <ArrowRight className="w-3 h-3" />
                        <span>Registered in Database</span>
                      </div>
                    </div>

                    {/* Present Today */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Present Today</span>
                        <p className="text-3xl font-bold text-blue-600 mt-1">{presentTodayCount}</p>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">Updated live</p>
                    </div>

                    {/* Absent Today */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Absent Today</span>
                        <p className="text-3xl font-bold text-red-500 mt-1">{absentTodayCount}</p>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">Requires verification</p>
                    </div>

                    {/* Attendance % */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Attendance %</span>
                        <p className="text-3xl font-bold text-slate-800 mt-1">{attendanceRateToday}</p>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full transition-all duration-300" 
                          style={{ width: attendanceRateToday }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Class-wise summary & Quick actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Class overview (Simulated GridView) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800">Class-Wise Attendance Sheet Overview (Today)</h3>
                        <div className="flex gap-2">
                          <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded text-xs text-blue-600 font-medium">Real-time stats</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50">
                              <tr>
                                <th className="px-4 py-3 font-semibold">Class / Grade</th>
                                <th className="px-4 py-3 font-semibold text-center">Registered</th>
                                <th className="px-4 py-3 font-semibold text-center text-emerald-600">Present</th>
                                <th className="px-4 py-3 font-semibold text-center text-rose-600">Absent</th>
                                <th className="px-4 py-3 font-semibold text-center text-blue-600">Rate %</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {classOverviewData.map((d, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-4 py-3.5 font-semibold text-slate-700">{d.className}</td>
                                  <td className="px-4 py-3.5 text-center text-slate-500 font-medium">{d.totalReg}</td>
                                  <td className="px-4 py-3.5 text-center text-emerald-600 font-bold">{d.presentToday}</td>
                                  <td className="px-4 py-3.5 text-center text-rose-600 font-bold">{d.absentToday}</td>
                                  <td className="px-4 py-3.5 text-center text-cyan-600 font-bold">{d.rate}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Quick navigation actions cards */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                      <div className="p-5 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Operational Shortcuts</h3>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                        <button
                          onClick={() => setActivePage("attendance")}
                          className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block">Open Attendance Ledger</span>
                              <span className="text-xs text-slate-400">Add or edit present/absent sheets for any date.</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </button>

                        <button
                          onClick={() => setActivePage("students")}
                          className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-100">
                              <Users className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block">Manage Students Directory</span>
                              <span className="text-xs text-slate-400">Enroll new students, search roll codes, or update records.</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                        </button>

                        <button
                          onClick={() => setActivePage("reports")}
                          className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-cyan-500 hover:bg-cyan-50/30 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-cyan-50 rounded-lg text-cyan-600 group-hover:bg-cyan-100">
                              <FileSpreadsheet className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block">Generate Analytical Reports</span>
                              <span className="text-xs text-slate-400">Generate printable class summaries, histories, or CSV sheets.</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePage === "students" && (
                <motion.div
                  key="students"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Student Directory Management</h1>
                      <p className="text-slate-500">Simulates ASP.NET validation engines, database INSERTs, UPDATEs, and DELETEs.</p>
                    </div>
                    {studentSuccessMessage && (
                      <div className="bg-emerald-50 text-emerald-800 px-4 py-2 border border-emerald-100 rounded-lg text-xs font-semibold shadow-sm">
                        {studentSuccessMessage}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Add / Edit Form Panel (Bootstrap layout) */}
                    <div className="lg:col-span-4">
                      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
                        <div className="bg-blue-900 text-white p-4">
                          <h2 className="font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            {studentFormId === null ? "Add New Student" : "Edit Student Profile"}
                          </h2>
                          <span className="text-[10px] text-blue-200 block font-mono">ASP.NET Validation Active</span>
                        </div>

                        <form onSubmit={handleSaveStudent} className="p-5 space-y-4">
                          {studentFormError && (
                            <div className="p-3 bg-rose-50 text-rose-800 rounded-lg border border-rose-100 text-xs font-medium">
                              {studentFormError}
                            </div>
                          )}

                          {/* Roll Number */}
                          <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Roll Number <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={txtRollNumber}
                              onChange={(e) => setTxtRollNumber(e.target.value)}
                              placeholder="e.g. R011"
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold uppercase"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">Simulates Unique Constraint check</p>
                          </div>

                          {/* Full Name */}
                          <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Student Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={txtFullName}
                              onChange={(e) => setTxtFullName(e.target.value)}
                              placeholder="e.g. Sarah Connor"
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">ASP.NET RequiredFieldValidator simulation</p>
                          </div>

                          {/* Class */}
                          <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Class / Grade <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={ddlClass}
                              onChange={(e) => setDdlClass(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            >
                              <option value="">Select Class</option>
                              <option value="Grade 10">Grade 10</option>
                              <option value="Grade 11">Grade 11</option>
                              <option value="Grade 12">Grade 12</option>
                            </select>
                          </div>

                          {/* Section */}
                          <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Section <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={ddlSection}
                              onChange={(e) => setDdlSection(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            >
                              <option value="">Select Section</option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                            </select>
                          </div>

                          {/* Actions */}
                          <div className="pt-2 space-y-2">
                            <button
                              type="submit"
                              className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                            >
                              {studentFormId === null ? <Plus className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                              {studentFormId === null ? "Save Student profile" : "Update Student Profile"}
                            </button>

                            {studentFormId !== null && (
                              <button
                                type="button"
                                onClick={handleClearStudentForm}
                                className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
                              >
                                Cancel Update
                              </button>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Students List Directory with Search (ASP.NET GridView simulation) */}
                    <div className="lg:col-span-8">
                      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <h3 className="font-bold text-slate-800 text-base">Registered Student Roster</h3>
                          
                          {/* Search box */}
                          <div className="relative w-full sm:w-64">
                            <input
                              type="text"
                              value={studentSearchKeyword}
                              onChange={(e) => setStudentSearchKeyword(e.target.value)}
                              placeholder="Search Roll No or Name..."
                              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
                          </div>
                        </div>

                        {/* Roster GridView */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50">
                              <tr>
                                <th className="px-6 py-3 font-semibold">Roll Number</th>
                                <th className="px-6 py-3 font-semibold">Full Name</th>
                                <th className="px-6 py-3 font-semibold">Class / Grade</th>
                                <th className="px-6 py-3 font-semibold text-center">Section</th>
                                <th className="px-6 py-3 font-semibold text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {students
                                .filter(
                                  (s) =>
                                    !studentSearchKeyword ||
                                    s.fullName.toLowerCase().includes(studentSearchKeyword.toLowerCase()) ||
                                    s.rollNumber.toLowerCase().includes(studentSearchKeyword.toLowerCase())
                                )
                                .map((student) => (
                                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800 uppercase tracking-tight">{student.rollNumber}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-700">{student.fullName}</td>
                                    <td className="px-6 py-4 font-medium text-slate-500">{student.classVal}</td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-600">{student.sectionVal}</td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          onClick={() => handleEditStudentClick(student)}
                                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                                          title="Edit student"
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteStudentClick(student.id)}
                                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                                          title="Delete student"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              {students.filter(
                                (s) =>
                                  !studentSearchKeyword ||
                                  s.fullName.toLowerCase().includes(studentSearchKeyword.toLowerCase()) ||
                                  s.rollNumber.toLowerCase().includes(studentSearchKeyword.toLowerCase())
                              ).length === 0 && (
                                <tr>
                                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                    No students found matching your criteria.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePage === "attendance" && (
                <motion.div
                  key="attendance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Daily Attendance Ledger</h1>
                      <p className="text-slate-500">Record daily sheets, manage entries, and update student logs.</p>
                    </div>
                    {attendanceStatusMessage && (
                      <div className="bg-sky-50 text-sky-800 px-4 py-2 border border-sky-100 rounded-lg text-xs font-semibold shadow-sm">
                        {attendanceStatusMessage}
                      </div>
                    )}
                  </div>

                  {/* Date & Class Select Configuration panel */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      {/* Date selection */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Attendance Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={txtAttendanceDate}
                          onChange={(e) => {
                            setTxtAttendanceDate(e.target.value);
                            setSheetLoaded(false);
                          }}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                        />
                      </div>

                      {/* Class Selection */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Class / Grade <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={ddlClassFilter}
                          onChange={(e) => {
                            setDdlClassFilter(e.target.value);
                            setSheetLoaded(false);
                          }}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                        >
                          <option value="">Select Class</option>
                          <option value="Grade 10">Grade 10</option>
                          <option value="Grade 11">Grade 11</option>
                          <option value="Grade 12">Grade 12</option>
                        </select>
                      </div>

                      {/* Load Button */}
                      <div>
                        <button
                          type="button"
                          onClick={handleLoadSheet}
                          className="w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow hover:bg-blue-700 transition-all"
                        >
                          Load Attendance Sheet
                        </button>
                      </div>

                      {/* Fast mark shortcuts */}
                      {sheetLoaded && (
                        <div className="flex items-center gap-1 justify-end md:justify-center">
                          <button
                            type="button"
                            onClick={() => handleMarkAllSheet("Present")}
                            className="px-2.5 py-1.5 border border-emerald-200 text-emerald-700 bg-emerald-50 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                          >
                            Mark All Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkAllSheet("Absent")}
                            className="px-2.5 py-1.5 border border-rose-200 text-rose-700 bg-rose-50 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors"
                          >
                            Mark All Absent
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attendance Sheet List */}
                  {sheetLoaded ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-800 text-base">
                            Roll Sheet: <span className="text-blue-600">{ddlClassFilter}</span>
                          </h3>
                          <span className="text-xs text-slate-400 font-medium">Date: {txtAttendanceDate}</span>
                        </div>
                        {attendance.filter((a) => a.date === txtAttendanceDate && students.find((s) => s.id === a.studentId)?.classVal === ddlClassFilter).length > 0 ? (
                          <span className="px-2.5 py-1 text-[10px] bg-sky-100 text-sky-800 rounded font-bold uppercase tracking-wide">
                            Sheet Already Saved (Edit Mode)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[10px] bg-amber-100 text-amber-800 rounded font-bold uppercase tracking-wide">
                            New Attendance Sheet
                          </span>
                        )}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle">
                          <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50">
                            <tr>
                              <th className="px-6 py-3 font-semibold">Roll Number</th>
                              <th className="px-6 py-3 font-semibold">Full Name</th>
                              <th className="px-6 py-3 font-semibold text-center">Section</th>
                              <th className="px-6 py-3 font-semibold text-center">Attendance Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {currentSheetRecords.map((record) => {
                              const s = students.find((st) => st.id === record.studentId);
                              if (!s) return null;
                              return (
                                <tr key={record.studentId} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-3.5 font-bold text-slate-800 uppercase tracking-tight">{s.rollNumber}</td>
                                  <td className="px-6 py-3.5 font-semibold text-slate-700">{s.fullName}</td>
                                  <td className="px-6 py-3.5 text-center font-bold text-slate-600">{s.sectionVal}</td>
                                  <td className="px-6 py-3.5">
                                    <div className="flex items-center justify-center gap-6">
                                      {/* Present Radio button */}
                                      <label className="flex items-center gap-1.5 cursor-pointer group">
                                        <input
                                          type="radio"
                                          name={`student_rad_${record.studentId}`}
                                          checked={record.status === "Present"}
                                          onChange={() => handleStatusChangeInSheet(record.studentId, "Present")}
                                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                        />
                                        <span className={`text-sm font-bold ${record.status === "Present" ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                                          Present
                                        </span>
                                      </label>

                                      {/* Absent Radio button */}
                                      <label className="flex items-center gap-1.5 cursor-pointer group">
                                        <input
                                          type="radio"
                                          name={`student_rad_${record.studentId}`}
                                          checked={record.status === "Absent"}
                                          onChange={() => handleStatusChangeInSheet(record.studentId, "Absent")}
                                          className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-slate-300"
                                        />
                                        <span className={`text-sm font-bold ${record.status === "Absent" ? "text-rose-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                                          Absent
                                        </span>
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 gap-3">
                        <span className="text-xs text-slate-400 font-medium">
                          Verify selections. Saving will overwrite any duplicate sheet for this date and class.
                        </span>
                        <button
                          type="button"
                          onClick={handleSaveAttendanceSheet}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md transition-all"
                        >
                          Save Attendance Sheet
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-12 text-center">
                      <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="font-bold text-slate-700 mb-1">Attendance Sheet Pending</h3>
                      <p className="text-slate-400 text-sm max-w-sm mx-auto">
                        Please specify an attendance date and grade above, then click 'Load Attendance Sheet' to begin taking attendance.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activePage === "reports" && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-6 flex flex-wrap justify-between items-center gap-4 no-print">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Reports & Analytical Sheets</h1>
                      <p className="text-slate-500">Perform statistics aggregation, review individual students, or print catalogs.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-semibold transition-colors border border-slate-200"
                      >
                        <Printer className="w-4 h-4" />
                        Print Page
                      </button>
                      <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow transition-all"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Export to CSV
                      </button>
                    </div>
                  </div>

                  {/* Reports Tab Navigation */}
                  <div className="flex border-b border-slate-200 mb-6 no-print bg-white p-1 rounded-lg shadow-sm">
                    <button
                      onClick={() => setReportsTab("date")}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all uppercase tracking-wider ${
                        reportsTab === "date" 
                          ? "bg-blue-900 text-white shadow" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Attendance By Date
                    </button>
                    <button
                      onClick={() => setReportsTab("student")}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all uppercase tracking-wider ${
                        reportsTab === "student" 
                          ? "bg-blue-900 text-white shadow" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Attendance By Student
                    </button>
                    <button
                      onClick={() => setReportsTab("percentage")}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all uppercase tracking-wider ${
                        reportsTab === "percentage" 
                          ? "bg-blue-900 text-white shadow" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Attendance Rate Ledger
                    </button>
                  </div>

                  {/* Filters block */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-6 no-print">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Report Configuration Filters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      {/* Date Filter (Used for By Date report) */}
                      {reportsTab === "date" && (
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Target Date
                          </label>
                          <input
                            type="date"
                            value={txtReportDate}
                            onChange={(e) => setTxtReportDate(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                          />
                        </div>
                      )}

                      {/* Class Filter (Used for By Date and Percentage report) */}
                      {reportsTab !== "student" && (
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Class / Grade Filter
                          </label>
                          <select
                            value={ddlClassReport}
                            onChange={(e) => setDdlClassReport(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          >
                            <option value="">All Classes</option>
                            <option value="Grade 10">Grade 10</option>
                            <option value="Grade 11">Grade 11</option>
                            <option value="Grade 12">Grade 12</option>
                          </select>
                        </div>
                      )}

                      {/* Student Filter (Used for Student history report) */}
                      {reportsTab === "student" && (
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Select Student
                          </label>
                          <select
                            value={ddlStudentReport}
                            onChange={(e) => setDdlStudentReport(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                          >
                            <option value="">Select Student...</option>
                            {students.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.rollNumber} - {s.fullName} ({s.classVal})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Print Only Header */}
                  <div className="hidden d-print-block mb-6 text-center">
                    <h1 className="text-3xl font-bold">AttendancePro Ledger Report</h1>
                    <p className="text-sm text-slate-500">Generated on {new Date().toLocaleString()}</p>
                    <hr className="my-4" />
                  </div>

                  {/* Output Grids (Simulating GridView) */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 bg-white">
                      <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                        {reportsTab === "date" && `Class Attendance Ledger for Date: ${txtReportDate}`}
                        {reportsTab === "student" && `Attendance History Ledger for Selected Student`}
                        {reportsTab === "percentage" && `Attendance Rate Percentage Ledger`}
                      </h3>
                    </div>

                    {/* Table Renderers */}
                    {reportsTab === "date" && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle">
                          <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50">
                            <tr>
                              <th className="px-6 py-3 font-semibold">Roll Number</th>
                              <th className="px-6 py-3 font-semibold">Full Name</th>
                              <th className="px-6 py-3 font-semibold">Class / Grade</th>
                              <th className="px-6 py-3 font-semibold text-center">Section</th>
                              <th className="px-6 py-3 font-semibold text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {students
                              .filter((s) => !ddlClassReport || s.classVal === ddlClassReport)
                              .map((s) => {
                                const record = attendance.find((a) => a.studentId === s.id && a.date === txtReportDate);
                                return (
                                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800 uppercase tracking-tight">{s.rollNumber}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-700">{s.fullName}</td>
                                    <td className="px-6 py-4 font-medium text-slate-500">{s.classVal}</td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-600">{s.sectionVal}</td>
                                    <td className="px-6 py-4 text-center">
                                      {record ? (
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                          record.status === "Present" 
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                            : "bg-rose-50 text-rose-700 border border-rose-100"
                                        }`}>
                                          {record.status}
                                        </span>
                                      ) : (
                                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-400">
                                          Unrecorded
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            {students.filter((s) => !ddlClassReport || s.classVal === ddlClassReport).length === 0 && (
                              <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                  No registered students matching the criteria.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {reportsTab === "student" && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle">
                          <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50">
                            <tr>
                              <th className="px-6 py-3 font-semibold">Attendance Date</th>
                              <th className="px-6 py-3 font-semibold">Class / Grade</th>
                              <th className="px-6 py-3 font-semibold text-center">Section</th>
                              <th className="px-6 py-3 font-semibold text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {ddlStudentReport ? (
                              attendance
                                .filter((a) => a.studentId === Number(ddlStudentReport))
                                .sort((a, b) => b.date.localeCompare(a.date))
                                .map((a, idx) => {
                                  const s = students.find((st) => st.id === a.studentId);
                                  return (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="px-6 py-4 font-semibold text-slate-700">{a.date}</td>
                                      <td className="px-6 py-4 font-medium text-slate-500">{s?.classVal}</td>
                                      <td className="px-6 py-4 text-center font-bold text-slate-600">{s?.sectionVal}</td>
                                      <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                          a.status === "Present" 
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                            : "bg-rose-50 text-rose-700 border border-rose-100"
                                        }`}>
                                          {a.status}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })
                            ) : (
                              <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                                  Please select a student from the filter above to load history.
                                </td>
                              </tr>
                            )}
                            {ddlStudentReport && attendance.filter((a) => a.studentId === Number(ddlStudentReport)).length === 0 && (
                              <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                                  No historic logs recorded for this student yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {reportsTab === "percentage" && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle">
                          <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50">
                            <tr>
                              <th className="px-6 py-3 font-semibold">Roll Number</th>
                              <th className="px-6 py-3 font-semibold">Full Name</th>
                              <th className="px-6 py-3 font-semibold">Class / Grade</th>
                              <th className="px-6 py-3 font-semibold text-center">Section</th>
                              <th className="px-6 py-3 font-semibold text-center">School Days</th>
                              <th className="px-6 py-3 font-semibold text-center text-emerald-600">Present</th>
                              <th className="px-6 py-3 font-semibold text-center text-rose-600">Absent</th>
                              <th className="px-6 py-3 font-semibold text-center">Attendance Rate</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {students
                              .filter((s) => !ddlClassReport || s.classVal === ddlClassReport)
                              .map((s) => {
                                const history = attendance.filter((a) => a.studentId === s.id);
                                const total = history.length;
                                const presents = history.filter((a) => a.status === "Present").length;
                                const absents = history.filter((a) => a.status === "Absent").length;
                                const rate = total > 0 ? (presents / total) * 100 : 100;
                                return (
                                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800 uppercase tracking-tight">{s.rollNumber}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-700">{s.fullName}</td>
                                    <td className="px-6 py-4 font-medium text-slate-500">{s.classVal}</td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-600">{s.sectionVal}</td>
                                    <td className="px-6 py-4 text-center text-slate-500 font-bold">{total}</td>
                                    <td className="px-6 py-4 text-center text-emerald-600 font-bold">{presents}</td>
                                    <td className="px-6 py-4 text-center text-rose-600 font-bold">{absents}</td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center justify-center gap-2">
                                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                                          <div
                                            className={`h-full ${rate >= 75 ? "bg-emerald-500" : "bg-amber-500"}`}
                                            style={{ width: `${rate}%` }}
                                          ></div>
                                        </div>
                                        <span className={`font-bold ${rate >= 75 ? "text-emerald-600" : "text-amber-600"}`}>
                                          {rate.toFixed(1)}%
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            {students.filter((s) => !ddlClassReport || s.classVal === ddlClassReport).length === 0 && (
                              <tr>
                                <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                                  No registered students found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    ) : (
        // ==========================================
        // VISUAL STUDIO CODE & FILE EXPLORER VIEW
        // ==========================================
        <div className="flex flex-1 flex-col lg:flex-row bg-[#1e1e1e] text-[#d4d4d4] font-sans">
          {/* Solution Explorer Sidebar */}
          <aside className="w-full lg:w-72 bg-[#252526] border-b lg:border-b-0 lg:border-r border-[#3c3c3c] flex flex-col p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3c3c3c]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solution Explorer</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            {/* Simulated VS Tree */}
            <div className="space-y-1 text-xs select-none overflow-y-auto max-h-[350px] lg:max-h-none flex-1">
              <div className="flex items-center gap-1.5 py-1 text-slate-300 font-semibold">
                <Folder className="w-4 h-4 text-blue-400" />
                <span>Solution 'AttendanceSystem' (1 project)</span>
              </div>

              <div className="pl-4 space-y-1">
                <div className="flex items-center gap-1.5 py-1 text-slate-300 font-semibold">
                  <Folder className="w-4 h-4 text-sky-400" />
                  <span>AttendanceSystem</span>
                </div>

                <div className="pl-4 space-y-0.5">
                  {/* Properties */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 py-0.5 text-slate-400">
                      <Folder className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Properties</span>
                    </div>
                  </div>

                  {/* App_Data */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 py-0.5 text-slate-400">
                      <Folder className="w-3.5 h-3.5 text-yellow-500" />
                      <span>App_Data</span>
                    </div>
                    <div className="pl-4">
                      <button
                        onClick={() => setSelectedFile(sourceFiles.find((f) => f.filename === "Database.sql")!)}
                        className={`flex items-center gap-1.5 py-0.5 w-full text-left rounded px-1 transition-colors ${
                          selectedFile.filename === "Database.sql" ? "bg-[#37373d] text-white" : "hover:bg-[#2a2a2b] text-slate-400"
                        }`}
                      >
                        <Database className="w-3.5 h-3.5 text-amber-500" />
                        <span>Database.sql</span>
                      </button>
                    </div>
                  </div>

                  {/* CSS */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 py-0.5 text-slate-400">
                      <Folder className="w-3.5 h-3.5 text-yellow-500" />
                      <span>CSS</span>
                    </div>
                  </div>

                  {/* Root ASPX Files */}
                  {sourceFiles
                    .filter((f) => f.filename !== "Database.sql")
                    .map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedFile(file)}
                        className={`flex items-center gap-1.5 py-0.5 w-full text-left rounded px-1 transition-colors ${
                          selectedFile.path === file.path ? "bg-[#37373d] text-white" : "hover:bg-[#2a2a2b] text-slate-400"
                        }`}
                      >
                        <FileCode className={`w-3.5 h-3.5 ${
                          file.filename.endsWith(".cs") ? "text-blue-400" : "text-amber-500"
                        }`} />
                        <span className="truncate">{file.path.split("/").pop()}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Help Prompt */}
            <div className="mt-4 p-3 bg-[#1e1e1e] rounded-lg border border-[#3c3c3c] text-[11px] text-slate-400 space-y-1.5">
              <span className="font-bold text-slate-300 block">Visual Studio Integration:</span>
              <p className="leading-relaxed">
                These C# files are generated in your app workspace container. You can download the solution or copy them to run natively on Visual Studio 2026.
              </p>
            </div>
          </aside>

          {/* IDE Main view */}
          <section className="flex-1 flex flex-col bg-[#1e1e1e]">
            {/* Tab Bar / Header */}
            <div className="bg-[#2d2d2d] h-9 border-b border-[#252526] flex items-center justify-between px-4">
              <div className="flex items-center gap-2 text-xs">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-slate-200 font-mono">{selectedFile.path}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                {copiedNotification && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-bold border border-emerald-900 animate-pulse">
                    Copied Code!
                  </span>
                )}
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2.5 py-1 hover:bg-[#3c3c3c] text-xs font-semibold rounded text-slate-300 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy File Code
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#3c3c3c] hover:bg-[#4c4c4c] text-xs font-semibold rounded text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save File
                </button>
              </div>
            </div>

            {/* Code Content Container */}
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed bg-[#1e1e1e]">
              <pre className="text-[#9cdcfe] whitespace-pre-wrap selection:bg-blue-900 selection:text-white">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </section>
        </div>
      )}

      {/* Persistent App Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
          <span>&copy; 2026 Student Attendance Management System. Compliant with MS Visual Studio and LocalDB.</span>
          <span className="font-semibold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Interactive Simulation Live
          </span>
        </div>
      </footer>
    </div>
  );
}
