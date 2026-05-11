"use client"

import { useEffect, useState } from "react"
import { useFormikContext } from "formik"
import { MapPin } from "lucide-react"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { getProvinces, getCities } from "@/services/addressService"
import styles from "../Select/Select.module.css"

interface Province {
	id: number
	name: string
}

interface City {
	id: number
	name: string
}

interface Props {
	provinceFieldName?: string
	cityFieldName?: string
}

export default function ProvinceCityPicker({
	provinceFieldName = "provinceID",
	cityFieldName = "cityID",
}: Props) {
	const { values, setFieldValue, touched, errors } = useFormikContext<Record<string, any>>()
	const [provinces, setProvinces] = useState<Province[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [loadingProvinces, setLoadingProvinces] = useState(true)
	const [loadingCities, setLoadingCities] = useState(false)

	const provinceID = values[provinceFieldName]
	const cityID = values[cityFieldName]

	useEffect(() => {
		getProvinces()
			.then((res) => setProvinces(res?.data ?? []))
			.catch(() => setProvinces([]))
			.finally(() => setLoadingProvinces(false))
	}, [])

	useEffect(() => {
		if (!provinceID) {
			setCities([])
			return
		}
		setLoadingCities(true)
		getCities(Number(provinceID))
			.then((res) => setCities(res?.data ?? []))
			.catch(() => setCities([]))
			.finally(() => setLoadingCities(false))
	}, [provinceID])

	const handleProvinceChange = (value: string) => {
		setFieldValue(provinceFieldName, value)
		setFieldValue(cityFieldName, "")
		setCities([])
	}

	const provinceError = touched[provinceFieldName] && errors[provinceFieldName]
	const cityError = touched[cityFieldName] && errors[cityFieldName]

	return (
		<div className="grid grid-cols-2 gap-3">
			{/* Province */}
			<div className={styles.container}>
				<Select
					disabled={loadingProvinces}
					value={provinceID ? String(provinceID) : ""}
					onValueChange={handleProvinceChange}
				>
					<SelectTrigger
						className={cn(styles.trigger, provinceError && styles.error, "[&>svg]:hidden")}
					>
						<SelectValue placeholder=" " />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{provinces.map((p) => (
								<SelectItem key={p.id} value={String(p.id)}>
									{p.name}
								</SelectItem>
							))}
							{provinces.length === 0 && !loadingProvinces && (
								<SelectItem value="__none" disabled>
									استانی یافت نشد
								</SelectItem>
							)}
						</SelectGroup>
					</SelectContent>
				</Select>
				<label className={cn(styles.label, provinceID && styles.floating)}>
					{loadingProvinces ? "در حال بارگذاری..." : "استان"}
				</label>
				<MapPin className={cn(styles.icon, provinceError && "text-destructive")} />
			</div>

			{/* City */}
			<div className={styles.container}>
				<Select
					disabled={!provinceID || loadingCities}
					value={cityID ? String(cityID) : ""}
					onValueChange={(value) => setFieldValue(cityFieldName, value)}
				>
					<SelectTrigger
						className={cn(styles.trigger, cityError && styles.error, "[&>svg]:hidden")}
					>
						<SelectValue placeholder=" " />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{cities.map((c) => (
								<SelectItem key={c.id} value={String(c.id)}>
									{c.name}
								</SelectItem>
							))}
							{cities.length === 0 && provinceID && !loadingCities && (
								<SelectItem value="__none" disabled>
									شهری یافت نشد
								</SelectItem>
							)}
						</SelectGroup>
					</SelectContent>
				</Select>
				<label className={cn(styles.label, cityID && styles.floating)}>
					{loadingCities ? "در حال بارگذاری..." : !provinceID ? "ابتدا استان انتخاب کنید" : "شهر"}
				</label>
				<MapPin className={cn(styles.icon, cityError && "text-destructive")} />
			</div>
		</div>
	)
}
