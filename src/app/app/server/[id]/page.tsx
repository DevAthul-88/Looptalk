import type { Metadata, ResolvingMetadata } from 'next'
import { doc, getDoc } from '@firebase/firestore'
import { db } from '../../../../../lib/firebase'
import ChatLayout from '@/app/Layouts/ChatLayout'
import ChatArea from '@/components/ChatArea'

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // Get the server id from params
    const { id } = await params

    // Fetch the server's data from Firestore
    const serverRef = doc(db, 'servers', id)
    const serverSnapshot = await getDoc(serverRef)

    // Check if the server exists and extract the name
    const serverName = serverSnapshot.exists() ? serverSnapshot.data()?.name : 'Server'

    // Optionally access and extend parent metadata
    const previousOpenGraphImages = (await parent).openGraph?.images || []

    return {
        title: serverName,
        openGraph: {
            images: ['/default-server-image.jpg', ...previousOpenGraphImages],
        },
    }
}

export default function Page({ params, searchParams }: Props) {
    return (
        <ChatLayout>
            <ChatArea/>
        </ChatLayout>
    )
}
