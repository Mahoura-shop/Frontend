"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ClipboardList, Clock, CheckCircle, XCircle, AlertCircle, Phone } from "lucide-react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Input from "@/components/Custom/Input/Input"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import { upgradeRequestService, UpgradeRequest } from "@/services/upgradeRequestService"

const statusIcons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  pending: { icon: <Clock className="w-4 h-4" />, color: "text-yellow-600", bg: "bg-yellow-100" },
  approved: { icon: <CheckCircle className="w-4 h-4" />, color: "text-green-600", bg: "bg-green-100" },
  rejected: { icon: <XCircle className="w-4 h-4" />, color: "text-red-600", bg: "bg-red-100" },
  infoRequested: { icon: <AlertCircle className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-100" },
}

const reviewSchema = Yup.object({
  action: Yup.string().required("عملیات الزامی است"),
  adminNote: Yup.string(),
})

export default function UpgradeRequestsAdminPage() {
  const [requests, setRequests] = useState<UpgradeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [selectedRequest, setSelectedRequest] = useState<UpgradeRequest | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchRequests = async () => {
    try {
      const res = await upgradeRequestService.getAllUpgradeRequests(filterStatus || undefined)
      setRequests(res || [])
    } catch (error) {
      CustomToast("خطا در بارگذاری درخواست‌ها", "error")
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchRequests()
  }, [filterStatus])

  const handleReview = async (values: {
    action: string
    adminNote: string
  }) => {
    if (!selectedRequest) return

    setSubmitting(true)
    try {
      await upgradeRequestService.reviewUpgradeRequest(
        selectedRequest.id,
        values.action as 'approve' | 'reject' | 'info',
        values.adminNote,
      )

      const actionText = {
        approve: "تایید",
        reject: "رد",
        info: "درخواست اطلاعات",
      }[values.action] || "بروزرسانی"

      CustomToast(`درخواست با موفقیت ${actionText} شد`, "success")
      setReviewDialogOpen(false)
      setSelectedRequest(null)
      fetchRequests()
    } catch (error: any) {
      CustomToast(error.response?.data?.message || "خطا در پردازش درخواست", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusLabel = (status: number): string => {
    const labels: Record<number, string> = {
      1: "pending",
      2: "approved",
      3: "rejected",
      4: "infoRequested",
    }
    return labels[status] || "unknown"
  }

  const getTypeLabel = (typeValue: number): string => {
    const types: Record<number, string> = {
      3: "فروشنده (نقد)",
      4: "فروشنده (چک)",
      5: "همکار",
    }
    return types[typeValue] || "نامشخص"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const statusOptions = [
    { value: "", label: "همه درخواست‌ها" },
    { value: "pending", label: "در انتظار" },
    { value: "approved", label: "تایید شده" },
    { value: "rejected", label: "رد شده" },
    { value: "infoRequested", label: "درخواست اطلاعات" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-rose-500" />
          <h1 className="text-2xl font-bold">درخواست‌های ارتقاء حساب</h1>
        </div>
        <div className="w-64">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="فیلتر بر اساس وضعیت" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {requests.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500">درخواستی برای نمایش وجود ندارد</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-right">نام کسب‌وکار</TableHead>
                <TableHead className="text-right">شناسه ملی</TableHead>
                <TableHead className="text-right">نوع درخواست</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right">تاریخ</TableHead>
                <TableHead className="text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request, index) => {
                const statusLabel = getStatusLabel(request.status)
                const statusConfig = statusIcons[statusLabel]
                const typeLabel = getTypeLabel(request.requestedType as any)
                const canReview = request.status === 1 || request.status === 4

                return (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">{request.businessName}</TableCell>
                    <TableCell className="font-mono text-sm" dir="ltr">{request.taxID}</TableCell>
                    <TableCell className="text-sm">{typeLabel}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusConfig.bg} ${statusConfig.color} border-none`}
                      >
                        <span className="flex items-center gap-1">
                          {statusConfig.icon}
                          {statusLabel}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(request.createdAt).toLocaleDateString('fa-IR')}
                    </TableCell>
                    <TableCell>
                      {canReview ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setReviewDialogOpen(true)
                          }}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          بررسی
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-500">بسته‌شده</span>
                      )}
                    </TableCell>
                  </motion.tr>
                )
              })}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {selectedRequest && (
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>بررسی درخواست ارتقاء</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">نام کسب‌وکار</p>
                  <p className="font-medium">{selectedRequest.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">شناسه ملی</p>
                  <p className="font-medium font-mono" dir="ltr">{selectedRequest.taxID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">نوع درخواست</p>
                  <p className="font-medium">{getTypeLabel(selectedRequest.requestedType as any)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">شماره تماس</p>
                  <p className="font-medium flex items-center gap-2" dir="ltr">
                    <Phone className="w-4 h-4" />
                    {selectedRequest.userPhone}
                  </p>
                </div>
              </div>
              <Separator />
            </div>

            <Formik
              initialValues={{
                action: "",
                adminNote: "",
              }}
              validationSchema={reviewSchema}
              onSubmit={handleReview}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">عملیات</label>
                    <select
                      value={values.action}
                      onChange={(e) => setFieldValue("action", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="approve">تایید درخواست</option>
                      <option value="reject">رد درخواست</option>
                      <option value="info">درخواست اطلاعات بیشتر</option>
                    </select>
                    {errors.action && touched.action && (
                      <p className="text-red-500 text-sm mt-1">{errors.action}</p>
                    )}
                  </div>

                  <Input
                    name="adminNote"
                    label="یادداشت (اختیاری)"
                    placeholder="یادداشت خود را وارد کنید"
                    type="textarea"
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-rose-500 hover:bg-rose-600"
                    >
                      {submitting ? "در حال پردازش..." : "تأیید"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setReviewDialogOpen(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      انصراف
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
