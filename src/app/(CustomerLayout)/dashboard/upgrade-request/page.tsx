"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Briefcase, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Input from "@/components/Custom/Input/Input"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import { upgradeRequestService, UpgradeRequest } from "@/services/upgradeRequestService"

const userTypes = [
  { value: 3, label: "shopkeeperCash", fa: "فروشنده (نقد)" },
  { value: 4, label: "shopkeeperCheque", fa: "فروشنده (چک)" },
  { value: 5, label: "fellow", fa: "همکار" },
]

const statusIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  pending: { icon: <Clock className="w-5 h-5" />, color: "text-yellow-500" },
  approved: { icon: <CheckCircle className="w-5 h-5" />, color: "text-green-500" },
  rejected: { icon: <XCircle className="w-5 h-5" />, color: "text-red-500" },
  infoRequested: { icon: <AlertCircle className="w-5 h-5" />, color: "text-blue-500" },
}

const schema = Yup.object({
  requestedType: Yup.number().min(3, "نوع درخواست الزامی است").required("نوع درخواست الزامی است"),
  businessName: Yup.string().min(3, "نام کسب و کار کوتاه است").required("نام کسب و کار الزامی است"),
  taxID: Yup.string().min(10, "شناسه ملی نامعتبر است").required("شناسه ملی الزامی است"),
})

export default function UpgradeRequestPage() {
  const [requests, setRequests] = useState<UpgradeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchRequests = async () => {
    try {
      const res = await upgradeRequestService.getMyUpgradeRequests()
      setRequests(res || [])
    } catch (error) {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleSubmit = async (values: {
    requestedType: string
    businessName: string
    taxID: string
  }) => {
    setSubmitting(true)
    try {
      await upgradeRequestService.submitUpgradeRequest(
        Number(values.requestedType),
        values.businessName,
        values.taxID,
      )
      CustomToast("درخواست ارتقاء با موفقیت ثبت شد", "success")
      setDialogOpen(false)
      fetchRequests()
    } catch (error: any) {
      CustomToast(error.response?.data?.message || "خطا در ثبت درخواست", "error")
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
    const type = userTypes.find(t => t.value === typeValue)
    return type ? type.fa : "نامشخص"
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

  const hasPendingRequest = requests.some(r => r.status === 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-rose-500" />
          <h1 className="text-2xl font-bold">درخواست ارتقاء حساب</h1>
        </div>
        {!hasPendingRequest && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-rose-500 hover:bg-rose-600">درخواست جدید</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>درخواست ارتقاء حساب</DialogTitle>
              </DialogHeader>
              <Formik
                initialValues={{
                  requestedType: "",
                  businessName: "",
                  taxID: "",
                }}
                validationSchema={schema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">نوع حساب</label>
                      <select
                        value={values.requestedType}
                        onChange={(e) => setFieldValue("requestedType", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">انتخاب کنید</option>
                        {userTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.fa}
                          </option>
                        ))}
                      </select>
                      {errors.requestedType && touched.requestedType && (
                        <p className="text-red-500 text-sm mt-1">{errors.requestedType}</p>
                      )}
                    </div>

                    <Input
                      name="businessName"
                      label="نام کسب و کار"
                      placeholder="نام فروشگاه یا کسب و کار شما"
                      type="text"
                    />

                    <Input
                      name="taxID"
                      label="شناسه ملی / مالیاتی"
                      placeholder="شناسه 10 رقمی"
                      type="text"
                      dir="ltr"
                    />

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-rose-500 hover:bg-rose-600"
                    >
                      {submitting ? "در حال ارسال..." : "ارسال درخواست"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Separator />

      {requests.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500">درخواستی برای ارتقاء حساب وجود ندارد</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request, index) => {
            const statusLabel = getStatusLabel(request.status)
            const statusConfig = statusIcons[statusLabel] || statusIcons.pending
            const typeLabel = getTypeLabel(request.requestedType as any)

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{request.businessName}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          نوع درخواست شده: {typeLabel}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 ${statusConfig.color}`}>
                        {statusConfig.icon}
                        <span className="text-sm font-medium">{statusLabel}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">شناسه ملی</p>
                        <p className="font-medium font-mono" dir="ltr">{request.taxID}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">تاریخ درخواست</p>
                        <p className="font-medium">
                          {new Date(request.createdAt).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    </div>

                    {request.adminNote && (
                      <>
                        <Separator />
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-1">یادداشت مدیر:</p>
                          <p className="text-sm text-blue-800">{request.adminNote}</p>
                        </div>
                      </>
                    )}

                    {statusLabel === "infoRequested" && (
                      <div className="pt-2">
                        <Button
                          onClick={() => setDialogOpen(true)}
                          className="w-full bg-blue-500 hover:bg-blue-600"
                        >
                          دوباره ارسال
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
