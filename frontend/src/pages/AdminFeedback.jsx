import React, { useState, useEffect } from 'react'
import { fetchAdminFeedback, updateFeedbackStatus } from '@/services/adminService'
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
  MessageSquare,
  Clock,
  CheckCircle,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, resolved: 0 })
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    loadFeedback()
  }, [filters])

  const loadFeedback = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchAdminFeedback(
        filters.page,
        filters.limit,
        filters.status,
        filters.search
      )
      
      setFeedback(result.feedback)
      setPagination(result.pagination)
      
      // Calculate stats
      const total = result.pagination.totalFeedback
      const pending = result.feedback.filter(f => f.status === 'pending').length
      const reviewed = result.feedback.filter(f => f.status === 'reviewed').length
      const resolved = result.feedback.filter(f => f.status === 'resolved').length
      
      setStats({ total, pending, reviewed, resolved })
    } catch (error) {
      console.error('Error loading feedback:', error)
      setError('Failed to load feedback data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (feedbackId, newStatus) => {
    try {
      await updateFeedbackStatus(feedbackId, newStatus)
      // Reload feedback to reflect changes
      loadFeedback()
    } catch (error) {
      console.error('Error updating feedback status:', error)
      setError('Failed to update feedback status')
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

  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: 'destructive', icon: Clock },
      reviewed: { variant: 'secondary', icon: Eye },
      resolved: { variant: 'default', icon: CheckCircle }
    }
    
    const config = variants[status] || variants.pending
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
      <AdminSidebar title="Feedback Management" error={error}>
        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-lg">Loading feedback data...</p>
            </div>
          </div>
        </main>
      </AdminSidebar>
    )
  }

  return (
    <AdminSidebar title="Feedback Management" error={error}>
      <main className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination?.totalFeedback || 0}</div>
              <p className="text-xs text-muted-foreground">
                All feedback submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <Eye className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.reviewed}</div>
              <p className="text-xs text-muted-foreground">
                Being processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">
                Successfully handled
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback List</CardTitle>
            <CardDescription>
              Manage and respond to user feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
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
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feedback Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feedback</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No feedback found
                      </TableCell>
                    </TableRow>
                  ) : (
                    feedback.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="max-w-md">
                          <p className="truncate">{item.feedback}</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {item.userId?.name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.userId?.email || 'No email'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(item.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {item.status !== 'reviewed' && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(item._id, 'reviewed')}
                                >
                                  Mark as Reviewed
                                </DropdownMenuItem>
                              )}
                              {item.status !== 'resolved' && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(item._id, 'resolved')}
                                >
                                  Mark as Resolved
                                </DropdownMenuItem>
                              )}
                              {item.status !== 'pending' && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(item._id, 'pending')}
                                >
                                  Mark as Pending
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalFeedback)} of{' '}
                  {pagination.totalFeedback} results
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

export default AdminFeedback