import React, { useState, useEffect } from "react";
import { HomeIcon, Plus, Loader2, Compass } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { collection, addDoc, query, where, getDocs } from "@firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useForm } from "react-hook-form";
import { onAuthStateChanged } from "@firebase/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Server {
  id: string;
  name: string;
}

function ServersSidebar({ isSidebarOpen, location }: any) {
  const [servers, setServers] = useState<Server[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      serverName: "",
      category: "",
    },
  });

  useEffect(() => {
    const fetchServers = async (userId: string) => {
      try {
        const serversRef = collection(db, "servers");
        const q = query(serversRef, where("members", "array-contains", userId));
        const querySnapshot = await getDocs(q);

        const userServers: Server[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));

        setServers(userServers);
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchServers(user.uid);
      } else {
        setUserId(null);
        setServers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: { serverName: string, category: string }) => {
    try {
      setIsLoading(true);
      if (!userId) return;

      // Check if the server already exists
      const serversRef = collection(db, "servers");
      const q = query(serversRef, where("name", "==", data.serverName));
      const querySnapshot = await getDocs(q);

      // If a server with the same name exists, show an error message
      if (!querySnapshot.empty) {
        toast.error("A server with this name already exists.");
        setIsLoading(false);
        return;
      }

      // If no server exists with that name, create the new server
      const serverData = {
        name: data.serverName,
        members: [userId],
        category: data.category,
        createdAt: new Date(),
        ownerId: userId,
      };

      const serverRef = await addDoc(collection(db, "servers"), serverData);

      const channelData = {
        name: "general",
        createdAt: new Date(),
        serverId: serverRef.id,
      };

      await addDoc(collection(db, "servers", serverRef.id, "channels"), channelData);

      setServers((prev) => [...prev, { id: serverRef.id, name: data.serverName }]);
      setOpen(false);
      form.reset();
      toast.success("Server created successfully!");
      router.push(`/app/server/${serverRef?.id}`);
    } catch (error) {
      toast.error("Error creating server or channel.");
      console.error("Error creating server or channel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>

      <div
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static z-40 ${isSidebarOpen ? "w-20" : "w-16"
          } h-full bg-[#313338] flex flex-col py-3 space-y-3 transition-transform duration-200`}
      >
        <div className="flex flex-col items-center just space-y-3 flex-grow">
          <Tooltip>
            <TooltipTrigger>
              <Link
                href="/app/me"
                className={`w-10 h-10 ${location === "/"
                  ? "bg-rose-600"
                  : "bg-[#1E1F22] hover:bg-rose-600"
                  } rounded-2xl flex items-center justify-center hover:rounded-xl transition-all duration-200`}
              >
                <HomeIcon size={20} className="text-white" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Home</p>
            </TooltipContent>
          </Tooltip>

          {servers.length > 0 ? (
            servers.map((server) => (
              <Tooltip key={server.id}>
                <TooltipTrigger>
                  <Link
                    href={`/app/server/${server.id}`}
                    className="w-10 h-10 bg-[#1E1F22] rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:rounded-xl transition-all duration-200 border-gray-200"
                  >
                    <span className="text-white text-sm font-medium">
                      {server.name[0]?.toUpperCase()}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{server.name}</p>
                </TooltipContent>
              </Tooltip>
            ))
          ) : null}

          {/* Dialog and form for creating server */}
          <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
              <TooltipTrigger>
                <DialogTrigger asChild>
                  <div className="w-10 h-10 bg-[#1E1F22] rounded-2xl flex items-center justify-center hover:bg-green-600 hover:rounded-xl transition-all duration-200 group cursor-pointer">
                    <Plus
                      size={20}
                      className="text-green-500 group-hover:text-white transition-colors"
                    />
                  </div>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>New server</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-md bg-[#313338] border-none text-gray-100">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center text-gray-100">
                  Create a Server
                </DialogTitle>
                <DialogDescription className="text-center text-gray-300">
                  Your server is where you and your friends hang out. Make yours and start talking.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="serverName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-gray-200 uppercase">
                          Server Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter server name"
                            {...field}
                            className="bg-[#1E1F22] border-none text-gray-100 placeholder:text-gray-400 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-rose-500"
                          />
                        </FormControl>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-gray-200 uppercase">
                          Category
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-[#1E1F22] border-none text-gray-100 placeholder:text-gray-400 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-rose-500">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gaming">Gaming</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="art">Art</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Server"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Place Compass icon at the bottom */}
        <div className="flex flex-col items-center just space-y-3 flex-grow">
          <div className="flex-shrink-0 mt-auto">
            <Tooltip>
              <TooltipTrigger>
                <div className="w-10 h-10 bg-[#1E1F22] rounded-2xl flex items-center justify-center hover:bg-green-600 hover:rounded-xl transition-all duration-200 group cursor-pointer">
                  <Link href={"/app/servers"}>
                    <Compass
                      size={20}
                      className="text-green-500 group-hover:text-white transition-colors"
                    />
                  </Link>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Explore Servers</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>


    </TooltipProvider>
  );
}

export default ServersSidebar;
