import React, { useState, useEffect } from 'react'
import { fetchAdminSessions, updateSessionStatus } from '@/services/adminService'
import AdminSidebar from '@/components/Sidebar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Badge,
} from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Calendar,
  Activity,
  Users,
  PlayCircle,
  PauseCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Clock,
  MessageCircle,
  X,
  Send,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const AdminSession = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 })
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false)
  const [selectedSessionChats, setSelectedSessionChats] = useState(null)

  useEffect(() => {
    loadSessions()
  }, [filters])

  const loadSessions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchAdminSessions(
        filters.page,
        filters.limit,
        filters.status,
        filters.search
      )
      
      setSessions(result.sessions)
      setPagination(result.pagination)
      
      // Calculate stats
      const total = result.pagination.totalSessions
      const active = result.sessions.filter(s => s.isActive).length
      const inactive = result.sessions.filter(s => !s.isActive).length
      
      setStats({ total, active, inactive })
    } catch (error) {
      console.error('Error loading sessions:', error)
      setError('Failed to load session data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (session, newStatus) => {
    try {
      await updateSessionStatus(session.userId, session._id, newStatus)
      // Reload sessions to reflect changes
      loadSessions()
    } catch (error) {
      console.error('Error updating session status:', error)
      setError('Failed to update session status')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const handleOpenChatSidebar = (session) => {
    setSelectedSessionChats(session)
    setChatSidebarOpen(true)
  }

  const handleCloseChatSidebar = () => {
    setChatSidebarOpen(false)
    setSelectedSessionChats(null)
  }

  const getStatusBadge = (isActive) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'} className="flex items-center gap-1">
        {isActive ? (
          <>
            <PlayCircle className="h-3 w-3" />
            Active
          </>
        ) : (
          <>
            <PauseCircle className="h-3 w-3" />
            Inactive
          </>
        )}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminSidebar title="Session Management" error={error}>
        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-lg">Loading session data...</p>
            </div>
          </div>
        </main>
      </AdminSidebar>
    )
  }

  return (
    <AdminSidebar title="Session Management" error={error}>
      <div className="flex h-full">
        <main className="flex-1 space-y-6 p-6 overflow-y-auto">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination?.totalSessions || 0}</div>
              <p className="text-xs text-muted-foreground">
                All appointment sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Sessions</CardTitle>
              <PauseCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">
                Not currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {new Set(sessions.map(s => s.userId)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Users with sessions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Session List</CardTitle>
            <CardDescription>
              Manage user appointment sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sessions..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sessions Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Disease</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No sessions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessions.map((session) => (
                      <TableRow key={session._id}>
                        <TableCell className="font-medium">
                          {session.name || 'Unnamed Patient'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {session.userName || 'Unknown User'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {session.userEmail || 'No email'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {session.disease || 'Not specified'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(session.isActive)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageCircle className="h-3 w-3" />
                            {session.chats ? session.chats.length : 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(session.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenChatSidebar(session)}
                              className="flex items-center gap-1"
                            >
                              <MessageCircle className="h-3 w-3" />
                              Chats ({session.chats ? session.chats.length : 0})
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedSession(session)}
                                >
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Session Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed information about this appointment session
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedSession && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium">Patient Name</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedSession.name || 'Not provided'}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Disease/Condition</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedSession.disease || 'Not specified'}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">User</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedSession.userName} ({selectedSession.userEmail})
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Status</h4>
                                        {getStatusBadge(selectedSession.isActive)}
                                      </div>
                                    </div>
                                    {selectedSession.description && (
                                      <div>
                                        <h4 className="font-medium">Description</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedSession.description}
                                        </p>
                                      </div>
                                    )}
                                    {selectedSession.chats && selectedSession.chats.length > 0 && (
                                      <div>
                                        <h4 className="font-medium">Chat Messages ({selectedSession.chats.length})</h4>
                                        <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
                                          {selectedSession.chats.map((chat, index) => (
                                            <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                                              <strong>{chat.role}:</strong> {chat.content}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(session, !session.isActive)}
                                >
                                  {session.isActive ? 'Deactivate' : 'Activate'} Session
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(pagination.currentPage - 1) * filters.limit + 1} to{' '}
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalSessions)} of{' '}
                  {pagination.totalSessions} results
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </main>

        {/* Chat Sidebar */}
        {chatSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={handleCloseChatSidebar}
            />
            
            {/* Sidebar */}
            <div className="ml-auto w-96 bg-white shadow-xl h-full flex flex-col relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div>
                  <h3 className="text-lg font-semibold">Chat History</h3>
                  {selectedSessionChats && (
                    <p className="text-sm text-muted-foreground">
                      {selectedSessionChats.name || 'Unnamed Patient'} - {selectedSessionChats.disease || 'No condition'}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseChatSidebar}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedSessionChats && selectedSessionChats.chats && selectedSessionChats.chats.length > 0 ? (
                  selectedSessionChats.chats.map((chat, index) => (
                    <div 
                      key={index} 
                      className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          chat.role === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium opacity-80">
                            {chat.role === 'user' ? 'Patient' : 'Doctor AI'}
                          </span>
                          {chat.timestamp && (
                            <span className="text-xs opacity-60">
                              {new Date(chat.timestamp).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-center">
                    <div>
                      <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm">No chat messages found</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Chat history will appear here when available
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t p-4 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {selectedSessionChats?.chats?.length || 0} messages
                  </span>
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${selectedSessionChats?.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {selectedSessionChats?.isActive ? 'Active Session' : 'Inactive Session'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminSidebar>
  )
}

export default AdminSession
