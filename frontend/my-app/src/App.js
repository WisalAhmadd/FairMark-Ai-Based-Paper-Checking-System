import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Search, BarChart3, Clock, Download, TrendingUp, Users, FileSpreadsheet } from 'lucide-react';

// ============================================
// MAIN APP COMPONENT WITH ROUTING
// ============================================
export default function PaperGradingApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentResult, setCurrentResult] = useState(null);

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} onResultReady={setCurrentResult} />;
      case 'results':
        return <ResultsPage result={currentResult} onNavigate={setCurrentPage} />;
      case 'search':
        return <SearchPage onNavigate={setCurrentPage} onResultSelect={setCurrentResult} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'history':
        return <HistoryPage onNavigate={setCurrentPage} onResultSelect={setCurrentResult} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
}

// ============================================
// NAVBAR COMPONENT
// ============================================
function Navbar({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'history', label: 'History', icon: '📋' }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur">
              <BarChart3 size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Paper Grading</h1>
              <p className="text-xs text-blue-200">Intelligent Assessment System</p>
            </div>
          </div>

          <div className="flex gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === item.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-transparent hover:bg-white hover:bg-opacity-20'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ============================================
// PAGE 1: HOME - INSTRUCTIONS + UPLOAD
// ============================================
function HomePage({ onNavigate, onResultReady }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subject, setSubject] = useState('English Grammar');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.includes('image') || file.type.includes('pdf')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadAndGrade = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('subject', subject);

    try {
      const response = await fetch('http://localhost:5000/api/grade', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process paper');

      const data = await response.json();
      onResultReady(data);
      onNavigate('results');
    } catch (err) {
      setError(err.message || 'Error processing paper. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="text-8xl mb-6 animate-bounce">📝</div>
        <h2 className="text-5xl font-bold text-gray-900 mb-4">AI-Powered Paper Grading</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload answer sheets and get instant AI-powered grading with detailed feedback and analytics
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Instructions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">📖</span>
            How to Use
          </h3>

          <div className="space-y-6">
            <InstructionStep 
              num="1" 
              title="Prepare Your Answer Sheet"
              desc="Take a clear photo or scan the answer sheet. Ensure good lighting and readable text."
            />
            <InstructionStep 
              num="2" 
              title="Upload the File"
              desc="Click the upload area or drag & drop your file. Supports JPG, PNG, and PDF formats."
            />
            <InstructionStep 
              num="3" 
              title="Select Subject"
              desc="Choose the subject for accurate grading using subject-specific answer keys."
            />
            <InstructionStep 
              num="4" 
              title="Get Results"
              desc="AI will extract text, grade answers, and provide detailed feedback in seconds."
            />
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
            <h4 className="font-bold text-lg text-gray-900 mb-3">📌 Important Notes:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>File size limit: 10MB maximum</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Supported formats: JPG, PNG, PDF</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Ensure questions are labeled (Q1, Q2, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Student name and ID should be visible</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Upload Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload Answer Sheet</h3>

            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-4 border-dashed border-blue-300 rounded-2xl p-16 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
                <label htmlFor="fileUpload" className="cursor-pointer">
                  <Upload className="mx-auto mb-4 text-blue-500" size={64} />
                  <p className="text-xl font-bold text-gray-700 mb-2">
                    Drop file here or click to browse
                  </p>
                  <p className="text-gray-500">JPG, PNG, PDF (Max 10MB)</p>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <FileText className="text-green-600" size={32} />
                    <div>
                      <p className="font-bold text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <CheckCircle className="text-green-600" size={32} />
                </div>

                <div className="border-4 border-gray-200 rounded-xl overflow-hidden">
                  <img src={previewUrl} alt="Preview" className="w-full h-64 object-contain bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Subject:</label>
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  >
                    <option>English Grammar</option>
                    <option>Science</option>
                    <option>Mathematics</option>
                    <option>Computer Science</option>
                  </select>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {loading ? (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
                    <Clock className="mx-auto mb-4 text-yellow-600 animate-spin" size={48} />
                    <p className="text-xl font-bold text-yellow-800 mb-2">Processing Paper...</p>
                    <p className="text-yellow-700 mb-4">Extracting text and analyzing answers</p>
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full animate-pulse w-2/3"></div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={uploadAndGrade}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg"
                    >
                      Grade Paper
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <p className="text-3xl font-bold mb-2">85-90%</p>
              <p className="text-sm opacity-90">Accuracy Rate</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
              <p className="text-3xl font-bold mb-2">&lt;30s</p>
              <p className="text-sm opacity-90">Grading Time</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InstructionStep({ num, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
        {num}
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600">{desc}</p>
      </div>
    </div>
  );
}

// ============================================
// PAGE 2: RESULTS - DETAILED GRADING RESULTS
// ============================================
function ResultsPage({ result, onNavigate }) {
  if (!result) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-2xl text-gray-500">No results to display</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const getGradeColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const color = getGradeColor(result.score);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="space-y-8">
        {/* Score Card */}
        <div className={`rounded-2xl shadow-2xl p-10 text-white ${
          color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-700' :
          color === 'yellow' ? 'bg-gradient-to-br from-yellow-500 to-yellow-700' :
          'bg-gradient-to-br from-red-500 to-red-700'
        }`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xl opacity-90 mb-2">Total Score</p>
              <p className="text-7xl font-bold">{result.score}%</p>
            </div>
            <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-6xl font-bold text-gray-900">{getGrade(result.score)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <StatBox label="Questions" value={result.totalQuestions} />
            <StatBox label="Attempted" value={result.attempted} />
            <StatBox label="Correct" value={result.correctAnswers} />
            <StatBox label="Percentage" value={`${result.score}%`} />
          </div>
        </div>

        {/* Student Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Student Information</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <InfoBox label="Student Name" value={result.studentName || 'Not Detected'} />
            <InfoBox label="Student ID" value={result.rollNumber || 'Not Detected'} />
            <InfoBox label="Subject" value={result.subject} />
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900">Question-wise Analysis</h3>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-all">
              <Download size={20} />
              Export PDF
            </button>
          </div>

          <div className="space-y-6">
            {result.questions?.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-bold py-5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-xl"
        >
          Grade Another Paper
        </button>
      </div>
    </main>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center backdrop-blur">
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-purple-100">
      <p className="text-sm font-semibold text-gray-600 mb-2">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function QuestionCard({ question }) {
  const getScoreColor = (score, max) => {
    const pct = (score / max) * 100;
    return pct >= 80 ? 'green' : pct >= 50 ? 'yellow' : 'red';
  };

  const color = getScoreColor(question.score, question.maxScore);
  const colors = {
    green: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800' },
    yellow: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-800' },
    red: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-800' }
  };

  return (
    <div className={`border-l-4 ${colors[color].border} rounded-xl p-6 bg-gray-50 hover:shadow-lg transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-xl font-bold text-gray-900">Q{question.id}. {question.question}</p>
        <span className={`px-5 py-2 rounded-full font-bold text-lg ${colors[color].bg} ${colors[color].text}`}>
          {question.score}/{question.maxScore}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-sm font-bold text-blue-900 mb-2">Student's Answer</p>
          <p className="text-gray-700">{question.studentAnswer}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <p className="text-sm font-bold text-green-900 mb-2">Expected Answer</p>
          <p className="text-gray-700">{question.correctAnswer}</p>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
        <p className="text-sm font-bold text-purple-900 mb-2">AI Feedback</p>
        <p className="text-gray-700">{question.feedback}</p>
      </div>
    </div>
  );
}

// ============================================
// PAGE 3: SEARCH - SEARCH STUDENTS BY ID/NAME
// ============================================
function SearchPage({ onNavigate, onResultSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/search?query=${searchQuery}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewResult = (result) => {
    onResultSelect(result);
    onNavigate('results');
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Search size={40} className="text-blue-600" />
          Search Student Results
        </h2>

        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Student ID or Name..."
                className="w-full p-5 pr-12 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Clock className="mx-auto mb-4 text-blue-600 animate-spin" size={48} />
            <p className="text-xl text-gray-600">Searching...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((result, i) => (
              <div key={i} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer" onClick={() => viewResult(result)}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-bold text-gray-900">{result.studentName}</p>
                    <p className="text-gray-600">ID: {result.rollNumber} • Subject: {result.subject}</p>
                    <p className="text-sm text-gray-500 mt-1">{result.date}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-600">{result.score}%</p>
                    <p className="text-sm text-gray-600">Score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No results found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-xl text-gray-500">Enter Student ID or Name to search</p>
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================
// PAGE 4: DASHBOARD - STATISTICS (BONUS)
// ============================================
function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-8">Dashboard & Analytics</h2>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <DashboardCard icon={<Users size={40} />} title="Total Students" value="156" color="blue" />
        <DashboardCard icon={<FileSpreadsheet size={40} />} title="Papers Graded" value="342" color="green" />
        <DashboardCard icon={<TrendingUp size={40} />} title="Avg Score" value="76%" color="yellow" />
        <DashboardCard icon={<BarChart3 size={40} />} title="Success Rate" value="89%" color="purple" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {['Ali Ahmed - 85%', 'Sara Khan - 92%', 'Hassan Ali - 78%'].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{item}</span>
                <span className="text-sm text-gray-500">Just now</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Performers</h3>
          <div className="space-y-4">
            {[
              { name: 'Sara Khan', score: 95 },
              { name: 'Ahmed Raza', score: 92 },
              { name: 'Fatima Ali', score: 90 }
            ].map((student, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <span className="font-semibold text-gray-900">{student.name}</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{student.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function DashboardCard({ icon, title, value, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform`}>
      <div className="mb-4">{icon}</div>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className="text-sm opacity-90">{title}</p>
    </div>
  );
}

// ============================================
// PAGE 5: HISTORY - ALL GRADING RESULTS (BONUS)
// ============================================
function HistoryPage({ onNavigate, onResultSelect }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/history');
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'high') return item.score >= 80;
    if (filter === 'medium') return item.score >= 60 && item.score < 80;
    if (filter === 'low') return item.score < 60;
    return true;
  });

  const viewDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/result/${id}`);
      const data = await response.json();
      onResultSelect(data);
      onNavigate('results');
    } catch (err) {
      console.error('Failed to fetch result details');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">Grading History</h2>
          <div className="flex gap-3">
            <button
              onClick={fetchHistory}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              ↻ Refresh
            </button>
            <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2">
              <Download size={20} />
              Export All
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'high', label: 'High (≥80%)' },
            { id: 'medium', label: 'Medium (60-79%)' },
            { id: 'low', label: 'Low (<60%)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Clock className="mx-auto mb-4 text-blue-600 animate-spin" size={48} />
            <p className="text-xl text-gray-600">Loading history...</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Date & Time</th>
                  <th className="px-6 py-4 text-left font-bold">Student Name</th>
                  <th className="px-6 py-4 text-left font-bold">Student ID</th>
                  <th className="px-6 py-4 text-left font-bold">Subject</th>
                  <th className="px-6 py-4 text-left font-bold">Score</th>
                  <th className="px-6 py-4 text-left font-bold">Grade</th>
                  <th className="px-6 py-4 text-left font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHistory.map((item, i) => (
                  <tr key={i} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.student_name}</td>
                    <td className="px-6 py-4 text-gray-600">{item.roll_number || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600">{item.subject}</td>
                    <td className="px-6 py-4">
                      <span className="text-2xl font-bold text-blue-600">{item.score}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                        item.score >= 80 ? 'bg-green-100 text-green-800' :
                        item.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.score >= 90 ? 'A+' : item.score >= 80 ? 'A' : item.score >= 70 ? 'B' : item.score >= 60 ? 'C' : 'D'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewDetails(item.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <FileText className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-2xl font-bold text-gray-400 mb-2">No results found</p>
            <p className="text-gray-500">
              {filter === 'all' ? 'Start grading papers to see history here' : 'No results match this filter'}
            </p>
          </div>
        )}

        {/* Statistics Summary */}
        {filteredHistory.length > 0 && (
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-3xl font-bold text-blue-600 mb-2">{filteredHistory.length}</p>
              <p className="text-gray-700 font-semibold">Total Results</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <p className="text-3xl font-bold text-green-600 mb-2">
                {Math.round(filteredHistory.reduce((sum, item) => sum + item.score, 0) / filteredHistory.length)}%
              </p>
              <p className="text-gray-700 font-semibold">Average Score</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {Math.max(...filteredHistory.map(item => item.score))}%
              </p>
              <p className="text-gray-700 font-semibold">Highest Score</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
              <p className="text-3xl font-bold text-yellow-600 mb-2">
                {Math.min(...filteredHistory.map(item => item.score))}%
              </p>
              <p className="text-gray-700 font-semibold">Lowest Score</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================
// FOOTER COMPONENT
// ============================================
function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">AI Paper Grading</h3>
            <p className="text-gray-400 mb-4">
              Intelligent assessment system powered by Machine Learning and Natural Language Processing
            </p>
            <div className="flex gap-4">
              <span className="text-3xl">🤖</span>
              <span className="text-3xl">📊</span>
              <span className="text-3xl">🎓</span>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li>• Instant AI Grading</li>
              <li>• Detailed Feedback</li>
              <li>• Student Analytics</li>
              <li>• History Tracking</li>
              <li>• Export Reports</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Technology</h4>
            <ul className="space-y-2 text-gray-400">
              <li>• React.js Frontend</li>
              <li>• Python Flask Backend</li>
              <li>• Tesseract OCR</li>
              <li>• Sentence-BERT AI</li>
              <li>• PostgreSQL Database</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 AI Paper Grading System. All rights reserved.</p>
          <p className="text-sm mt-2">Powered by Artificial Intelligence & Machine Learning</p>
        </div>
      </div>
    </footer>
  );
}