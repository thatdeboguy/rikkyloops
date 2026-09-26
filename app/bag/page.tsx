import { Bag } from "@/components/store";
export const metadata = { title: "Your bag" };
export default function BagPage() { return <><div className="page-heading"><span className="eyebrow">YOUR LITTLE COLLECTION OF JOY</span><h1>Your shopping bag</h1></div><Bag/></>; }
