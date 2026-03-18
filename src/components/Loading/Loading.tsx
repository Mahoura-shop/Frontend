import { Spinner } from "../ui/spinner";

export default function Loading({ size = 16 }: { size?: number }) {
	return <Spinner size={size} />;
}
