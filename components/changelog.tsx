/* eslint-disable react/jsx-no-comment-textnodes */
"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { format, formatDistance, formatRelative, subHours } from 'date-fns'

import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

const alerts = [
  { key: 0, title: "Testing one two three...", description: "It's time to make your mark, anon.", author: "", datetime: "" },
  { key: 1, title: "Analysts", description: "", author: "", datetime: "" },
];
export function Changelog() {
  type ChangelogType = {
    version: string;
    date: string;
    description: string;
  };
  type AlertType = {
    key: number;
    title: string;
    description: string;
    author: string;
    datetime: string;
  };
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedCategory = selectedIndex === 0 ? "developers" : "analysts";
  const [changelogs, setChangelogs] = useState<ChangelogType[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  useEffect(() => {
    fetch('https://wnr1c6qx6jcz9qde.public.blob.vercel-storage.com/r2/changelog-cTAxIXYNNmnBdGtFigG2gZ6pgDCiE7.json') // replace with the actual path
      .then(response => response.json())
      .then(data => setChangelogs(data));
  }, []);
  useEffect(() => {
    fetch('https://wnr1c6qx6jcz9qde.public.blob.vercel-storage.com/r2/alerts-GSQLF4HNDgvzKqV79AEOURGzuba4DX.json') // replace with the actual path
      .then(response => response.json())
      .then(data => setAlerts(data));
  }, []);
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-4 md:py-8 md:w-[380px]">
      {/* <form className="w-full flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-neutral-800"
              placeholder="Search updates..."
              type="search"
            />
          </div>
        </form> */}
      <ScrollArea className="h-screen w-[360px]">

        <div className="flex flex-wrap gap-4 mb-4">
          <Tabs defaultValue="alerts" className="w-[350px] p-0">
            <TabsList className="grid w-[320px] mx-auto grid-cols-2 bg-neutral-900 font-mono uppercase">
              <TabsTrigger value="alerts">Alerts
                {/* <Badge className="text-xs rounded-full" variant="default">2</Badge> */}
              </TabsTrigger>
              <TabsTrigger value="changelog">Changelogs
                {/* <Badge className="text-xs rounded-full" variant="secondary">1</Badge> */}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="changelog">
              <Card className="bg-transparent border-none p-0">
                <CardHeader>
                  <CardTitle className="text-xl">Recent Deployments</CardTitle>
                  <CardDescription className="text-sm">
                    Feedback is always welcome!
                  </CardDescription>
                </CardHeader>
                <CardContent className="gap-4">
                  {changelogs.map((changelog) => (
                    <Card key={changelog.version} className="mb-6 bg-neutral-800">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{changelog.version}</CardTitle>
                        </div>
                        <CardDescription className="text-sm">{changelog.date}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2 text-xs">{changelog.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="alerts">
              <Card className="bg-transparent border-none p-0">
                <CardContent className="flex flex-col gap-6 mt-6 px-4 pb-32">
                {alerts.slice().reverse().map((alert) => (
                    <Alert key={alert.key} className="bg-neutral-900">
                      <AlertTitle className="text-sm flex flex-row justify-between">
                        <span>{alert.title}</span>
                      </AlertTitle>
                      <Separator className="my-3" />
                      <AlertDescription className="text-xs">
                        {alert.description}
                      </AlertDescription>
                      <Separator className="my-3" />
                      <AlertDescription className="text-sm flex flex-row justify-between">
                        <span className="font-mono text-xs self-center">by {alert.author}</span>
                        <span className="font-mono text-xs self-center">{formatDistance(new Date(alert.datetime), new Date(), { addSuffix: true })}</span>
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
                <CardFooter className="bg-neutral-900 block fixed bottom-4 p-0 pt-8 -m-4 shadow-lg border-t border-neutral-800">
                  <div className="px-8 flex w-full max-w-sm items-center space-x-2">
                    <Input type="email" placeholder="Email" disabled />
                    <Button type="submit" variant="outline" className="bg-neutral-800" disabled>Subscribe</Button>
                  </div>

                  <div className="w-full block text-xs px-8 pb-8">
                    <Separator className="my-3" />

                    <span>
                      By entering your email above you agree to receive occasional updates related to the Forge ecosystem.
                    </span>
                  </div>

                </CardFooter>

              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
      {/* <div className="flex justify-center mt-8">
        <Button className="px-3 py-1 mr-1" variant="outline">
          Previous
        </Button>
        <Button className="px-3 py-1 mr-1">1</Button>
        <Button className="px-3 py-1 mr-1" variant="outline">
          2
        </Button>
        <Button className="px-3 py-1 mr-1" variant="outline">
          3
        </Button>
        <Button className="px-3 py-1" variant="outline">
          Next
        </Button>
      </div> */}
    </div>
  )
}


function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}


function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  )
}
