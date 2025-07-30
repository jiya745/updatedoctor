import React, { useState, useEffect } from 'react'
import { fetchAdminUsers, fetchUserDetails, updateUserStatus } from '@/services/adminService'
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
  Users,
  UserCheck,
  UserX,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Activity,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const AdminUser = () => {
  const [users, setUsers] = useState([])
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
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [filters])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchAdminUsers(
        filters.page,
        filters.limit
      )
      
      setUsers(result.users)
      setPagination(result.pagination)
      
      // Calculate stats
      const total = result.pagination.totalUsers
      const active = result.users.filter(u => u.isActive !== false).length
      const inactive = result.users.filter(u => u.isActive === false).length
      
      setStats({ total, active, inactive })
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const loadUserDetails = async (userId) => {
    try {
      setDetailsLoading(true)
      const details = await fetchUserDetails(userId)
      setUserDetails(details)
    } catch (error) {
      console.error('Error loading user details:', error)
      setError('Failed to load user details')
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus)
      // Reload users to reflect changes
      loadUsers()
      // Update user details if currently viewing this user
      if (selectedUser?._id === userId) {
        loadUserDetails(userId)
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      setError(error.message || 'Failed to update user status')
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

  const handleViewUser = async (user) => {
    setSelectedUser(user)
    await loadUserDetails(user._id)
  }

  const getStatusBadge = (isActive) => {
    return (
      <Badge variant={isActive !== false ? 'default' : 'secondary'} className="flex items-center gap-1">
        {isActive !== false ? (
          <>
            <UserCheck className="h-3 w-3" />
            Active
          </>
        ) : (
          <>
            <UserX className="h-3 w-3" />
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

  const filteredUsers = users.filter(user => {
    const searchTerm = filters.search.toLowerCase()
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm)
    
    if (filters.status === 'all') return matchesSearch
    if (filters.status === 'active') return matchesSearch && user.isActive !== false
    if (filters.status === 'inactive') return matchesSearch && user.isActive === false
    
    return matchesSearch
  })

  if (loading) {
    return (
      <AdminSidebar title="User Management" error={error}>
        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-lg">Loading user data...</p>
            </div>
          </div>
        </main>
      </AdminSidebar>
    )
  }

  return (
    <AdminSidebar title="User Management" error={error}>
      <main className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
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
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
              <UserX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">
                Deactivated accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => {
                  const userDate = new Date(u.createdAt)
                  const now = new Date()
                  return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Recent registrations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
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
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Appointments</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {user.name || 'No name provided'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user.isActive)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {user.appoitment_history ? user.appoitment_history.length : 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewUser(user)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>User Details</DialogTitle>
                                  <DialogDescription>
                                    Comprehensive information about this user
                                  </DialogDescription>
                                </DialogHeader>
                                {detailsLoading ? (
                                  <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                  </div>
                                ) : selectedUser && userDetails ? (
                                  <Tabs defaultValue="overview" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                      <TabsTrigger value="overview">Overview</TabsTrigger>
                                      <TabsTrigger value="appointments">Appointments</TabsTrigger>
                                      <TabsTrigger value="feedback">Feedback</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="overview" className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-medium text-sm text-muted-foreground">Full Name</h4>
                                          <p className="text-base">{userDetails.user.name || 'Not provided'}</p>
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-sm text-muted-foreground">Email Address</h4>
                                          <p className="text-base">{userDetails.user.email}</p>
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-sm text-muted-foreground">Account Status</h4>
                                          {getStatusBadge(userDetails.user.isActive)}
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-sm text-muted-foreground">Member Since</h4>
                                          <p className="text-base">{formatDate(userDetails.user.createdAt)}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-3 gap-4 pt-4">
                                        <Card>
                                          <CardContent className="pt-6">
                                            <div className="text-2xl font-bold">{userDetails.stats.totalAppointments}</div>
                                            <p className="text-xs text-muted-foreground">Total Appointments</p>
                                          </CardContent>
                                        </Card>
                                        <Card>
                                          <CardContent className="pt-6">
                                            <div className="text-2xl font-bold text-green-600">{userDetails.stats.activeAppointments}</div>
                                            <p className="text-xs text-muted-foreground">Active Sessions</p>
                                          </CardContent>
                                        </Card>
                                        <Card>
                                          <CardContent className="pt-6">
                                            <div className="text-2xl font-bold text-blue-600">{userDetails.feedback.length}</div>
                                            <p className="text-xs text-muted-foreground">Feedback Given</p>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="appointments" className="space-y-4">
                                      {userDetails.user.appoitment_history && userDetails.user.appoitment_history.length > 0 ? (
                                        <div className="space-y-3">
                                          {userDetails.user.appoitment_history.map((appointment, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                              <div className="flex justify-between items-start">
                                                <div>
                                                  <h4 className="font-medium">{appointment.name || 'Unnamed Patient'}</h4>
                                                  <p className="text-sm text-muted-foreground">{appointment.disease || 'No condition specified'}</p>
                                                  {appointment.description && (
                                                    <p className="text-sm mt-1">{appointment.description}</p>
                                                  )}
                                                </div>
                                                <Badge variant={appointment.isActive ? 'default' : 'secondary'}>
                                                  {appointment.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                              </div>
                                              {appointment.chats && appointment.chats.length > 0 && (
                                                <div className="mt-2">
                                                  <p className="text-xs text-muted-foreground">
                                                    {appointment.chats.length} chat messages
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-center text-muted-foreground py-8">No appointments found</p>
                                      )}
                                    </TabsContent>
                                    
                                    <TabsContent value="feedback" className="space-y-4">
                                      {userDetails.feedback && userDetails.feedback.length > 0 ? (
                                        <div className="space-y-3">
                                          {userDetails.feedback.map((feedback) => (
                                            <div key={feedback._id} className="border rounded-lg p-4">
                                              <div className="flex justify-between items-start">
                                                <p className="text-sm">{feedback.feedback}</p>
                                                <Badge variant={
                                                  feedback.status === 'resolved' ? 'default' :
                                                  feedback.status === 'reviewed' ? 'secondary' : 'destructive'
                                                }>
                                                  {feedback.status}
                                                </Badge>
                                              </div>
                                              <p className="text-xs text-muted-foreground mt-2">
                                                {formatDate(feedback.createdAt)}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-center text-muted-foreground py-8">No feedback found</p>
                                      )}
                                    </TabsContent>
                                  </Tabs>
                                ) : null}
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
                                  onClick={() => handleStatusUpdate(user._id, !user.isActive)}
                                  disabled={user.isActive === undefined ? false : user.isActive === true ? false : true}
                                >
                                  {user.isActive !== false ? 'Deactivate' : 'Activate'} User
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
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalUsers)} of{' '}
                  {pagination.totalUsers} results
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
    </AdminSidebar>
  )
}

export default AdminUser
