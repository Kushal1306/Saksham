'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle, Send, Users, Briefcase, BarChart, Settings, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react"

export function DashboardComponent() {
  const [view, setView] = useState("campaigns")
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: "Software Engineer", jobDescription: "We are looking for a skilled software engineer...", questions: "1. What are your skills?\n2. What do you know about our company?\n3. Describe a challenging project you've worked on." },
    { id: 2, name: "Product Manager", jobDescription: "Seeking an experienced product manager...", questions: "1. Describe a successful product launch you've led.\n2. How do you prioritize features?\n3. How do you handle stakeholder management?" },
  ])
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0])
  const [candidates, setCandidates] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", campaignId: 1, status: "Not Invited" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", campaignId: 1, status: "Invited" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", campaignId: 1, status: "Interview Completed" },
  ])
  const [newCandidate, setNewCandidate] = useState({ name: "", email: "" })
  const [newCampaign, setNewCampaign] = useState({ name: "", jobDescription: "", questions: "" })
  const [invitationTime, setInvitationTime] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })

  const handleAddCandidate = (e) => {
    e.preventDefault()
    if (!selectedCampaign) return
    const candidate = { ...newCandidate, id: candidates.length + 1, campaignId: selectedCampaign.id, status: "Not Invited" }
    setCandidates([...candidates, candidate])
    setNewCandidate({ name: "", email: "" })
  }

  const handleAddCampaign = (e) => {
    e.preventDefault()
    const campaign = { ...newCampaign, id: campaigns.length + 1 }
    setCampaigns([...campaigns, campaign])
    setNewCampaign({ name: "", jobDescription: "", questions: "" })
  }

  const handleInviteAll = () => {
    const updatedCandidates = candidates.map(candidate => 
      candidate.campaignId === selectedCampaign.id && candidate.status === "Not Invited" ? { ...candidate, status: "Invited" } : candidate)
    setCandidates(updatedCandidates)
  }

  const filteredCandidates = candidates.filter(candidate => candidate.campaignId === selectedCampaign?.id)

  const sortedCandidates = React.useMemo(() => {
    let sortableCandidates = [...filteredCandidates]
    if (sortConfig.key !== null) {
      sortableCandidates.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableCandidates
  }, [filteredCandidates, sortConfig])

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  return (
    (<div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">AI Recruiter</h2>
        </div>
        <nav className="mt-6">
          <a
            onClick={() => setView("campaigns")}
            className={`flex items-center px-6 py-3 text-gray-700 cursor-pointer ${view === 'campaigns' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            <Briefcase className="h-5 w-5 mr-3" />
            Campaigns
          </a>
          <a
            onClick={() => setView("candidates")}
            className={`flex items-center px-6 py-3 text-gray-700 cursor-pointer ${view === 'candidates' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            <Users className="h-5 w-5 mr-3" />
            Candidates
          </a>
          <a
            onClick={() => setView("reports")}
            className={`flex items-center px-6 py-3 text-gray-700 cursor-pointer ${view === 'reports' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            <BarChart className="h-5 w-5 mr-3" />
            Reports
          </a>
          <a
            onClick={() => setView("settings")}
            className={`flex items-center px-6 py-3 text-gray-700 cursor-pointer ${view === 'settings' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </a>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Campaign
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Campaign</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddCampaign} className="space-y-4">
                      <div>
                        <Label htmlFor="campaignName">Campaign Name</Label>
                        <Input
                          id="campaignName"
                          value={newCampaign.name}
                          onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                          required />
                      </div>
                      <div>
                        <Label htmlFor="jobDescription">Job Description</Label>
                        <Textarea
                          id="jobDescription"
                          value={newCampaign.jobDescription}
                          onChange={(e) => setNewCampaign({ ...newCampaign, jobDescription: e.target.value })}
                          required />
                      </div>
                      <div>
                        <Label htmlFor="questions">Screening Questions</Label>
                        <Textarea
                          id="questions"
                          value={newCampaign.questions}
                          onChange={(e) => setNewCampaign({ ...newCampaign, questions: e.target.value })}
                          placeholder="Enter each question on a new line" />
                      </div>
                      <Button type="submit">Create Campaign</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Select
                  value={selectedCampaign?.id.toString()}
                  onValueChange={(value) => setSelectedCampaign(campaigns.find(c => c.id.toString() === value) || null)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id.toString()}>{campaign.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        {/* Invitation Section */}
        <div className="bg-white shadow-sm mt-4">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Invite Candidates</h2>
              <div className="flex items-center space-x-4">
                <Input
                  type="datetime-local"
                  value={invitationTime}
                  onChange={(e) => setInvitationTime(e.target.value)}
                  className="w-44" />
                <Button onClick={handleInviteAll}>
                  <Send className="mr-2 h-4 w-4" />
                  Invite All
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="job-details">Job Details</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{filteredCandidates.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Invited Candidates</CardTitle>
                    <Send className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredCandidates.filter(c => c.status === "Invited").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredCandidates.filter(c => c.status === "Interview Completed").length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="candidates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add Candidate</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCandidate} className="flex space-x-2">
                    <Input
                      placeholder="Name"
                      value={newCandidate.name}
                      onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                      required />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={newCandidate.email}
                      onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                      required />
                    <Button type="submit">Add</Button>
                  </form>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Candidates</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => requestSort('name')} className="cursor-pointer">
                          Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? <ChevronUp className="inline ml-2" /> : <ChevronDown className="inline ml-2" />) : <ArrowUpDown className="inline ml-2" />}
                        </TableHead>
                        <TableHead onClick={() => requestSort('email')} className="cursor-pointer">
                          Email {sortConfig.key === 'email' ? (sortConfig.direction === 'ascending' ? <ChevronUp className="inline ml-2" /> : <ChevronDown className="inline ml-2" />) : <ArrowUpDown className="inline ml-2" />}
                        </TableHead>
                        <TableHead onClick={() => requestSort('status')} className="cursor-pointer">
                          Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? <ChevronUp className="inline ml-2" /> : <ChevronDown className="inline ml-2" />) : <ArrowUpDown className="inline ml-2" />}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedCandidates.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell>{candidate.name}</TableCell>
                          <TableCell>{candidate.email}</TableCell>
                          <TableCell>{candidate.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="job-details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <p>{selectedCampaign?.jobDescription}</p>
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Screening Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <p className="whitespace-pre-line">{selectedCampaign?.questions}</p>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>)
  );
}