"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { formatDate } from "@/lib/utils"
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  ShieldCheck,
  Trash2,
  AlertCircle,
  Crown,
  Loader2,
  ChevronDown,
  Pencil,
  Check,
  X,
} from "lucide-react"

type TeamRole = "OWNER" | "ADMIN" | "MEMBER"

interface TeamMember {
  id: string
  userId: string
  teamId: string
  role: TeamRole
  joinedAt: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

interface Team {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  createdAt: string
  updatedAt: string
  teamMembers: TeamMember[]
}

const roleConfig: Record<TeamRole, { label: string; icon: React.ReactNode; color: string }> = {
  OWNER: {
    label: "Owner",
    icon: <Crown className="h-4 w-4" />,
    color: "text-yellow-400",
  },
  ADMIN: {
    label: "Admin",
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "text-blue-400",
  },
  MEMBER: {
    label: "Member",
    icon: <Shield className="h-4 w-4" />,
    color: "text-dark-100",
  },
}

export default function TeamPage() {
  const { data: session } = useSession()
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [membersLoading, setMembersLoading] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<TeamRole>("MEMBER")
  const [inviting, setInviting] = useState(false)
  const [removeConfirm, setRemoveConfirm] = useState<TeamMember | null>(null)
  const [removing, setRemoving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  const currentUserEmail = session?.user?.email

  const currentUserMember = team?.teamMembers.find((m) => m.user.email === currentUserEmail)
  const currentUserRole = currentUserMember?.role ?? null
  const isOwner = currentUserRole === "OWNER"
  const isAdmin = currentUserRole === "ADMIN"
  const canManage = isOwner || isAdmin

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("/api/teams?limit=50")
        const json = await res.json()
        if (json.error) {
          addToast(json.error, "error")
          return
        }
        setTeams(json.data.teams)
        if (json.data.teams.length > 0) {
          setSelectedTeamId(json.data.teams[0].id)
        }
      } catch {
        addToast("Failed to load teams", "error")
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [addToast])

  useEffect(() => {
    if (!selectedTeamId) return

    async function fetchTeam() {
      setMembersLoading(true)
      try {
        const res = await fetch(`/api/teams/${selectedTeamId}`)
        const json = await res.json()
        if (json.error) {
          addToast(json.error, "error")
          return
        }
        setTeam(json.data)
      } catch {
        addToast("Failed to load team details", "error")
      } finally {
        setMembersLoading(false)
      }
    }
    fetchTeam()
  }, [selectedTeamId, addToast])

  function startEditing() {
    if (!team) return
    setEditName(team.name)
    setEditDescription(team.description ?? "")
    setEditing(true)
  }

  async function handleSave() {
    if (!team) return
    if (!editName.trim()) {
      addToast("Team name is required", "error")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/teams/${team.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), description: editDescription.trim() || undefined }),
      })
      const json = await res.json()
      if (json.error) {
        addToast(json.error, "error")
        return
      }
      setTeam((prev) => prev ? { ...prev, name: json.data.name, description: json.data.description } : prev)
      setEditing(false)
      addToast("Team updated", "success")
    } catch {
      addToast("Failed to update team", "error")
    } finally {
      setSaving(false)
    }
  }

  function cancelEditing() {
    setEditing(false)
  }

  async function handleInvite() {
    if (!team) return
    if (!inviteEmail.trim()) {
      addToast("Please enter an email address", "error")
      return
    }
    setInviting(true)
    try {
      const res = await fetch(`/api/teams/${team.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      })
      const json = await res.json()
      if (json.error) {
        addToast(json.error, "error")
        return
      }
      setTeam((prev) => {
        if (!prev) return prev
        return { ...prev, teamMembers: [...prev.teamMembers, json.data] }
      })
      addToast(`Invitation sent to ${inviteEmail}`, "success")
      setShowInviteDialog(false)
      setInviteEmail("")
      setInviteRole("MEMBER")
    } catch {
      addToast("Failed to invite member", "error")
    } finally {
      setInviting(false)
    }
  }

  async function handleRemove(member: TeamMember) {
    if (!team) return
    setRemoving(true)
    try {
      const res = await fetch(`/api/teams/${team.id}/members/${member.id}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (json.error) {
        addToast(json.error, "error")
        setRemoveConfirm(null)
        return
      }
      setTeam((prev) => {
        if (!prev) return prev
        return { ...prev, teamMembers: prev.teamMembers.filter((m) => m.id !== member.id) }
      })
      addToast(`${member.user.name ?? member.user.email} removed from team`, "success")
      setRemoveConfirm(null)
    } catch {
      addToast("Failed to remove member", "error")
    } finally {
      setRemoving(false)
    }
  }

  async function handleRoleChange(member: TeamMember, newRole: TeamRole) {
    if (!team) return
    try {
      const res = await fetch(`/api/teams/${team.id}/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      const json = await res.json()
      if (json.error) {
        addToast(json.error, "error")
        return
      }
      setTeam((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          teamMembers: prev.teamMembers.map((m) =>
            m.id === member.id ? { ...m, role: newRole } : m
          ),
        }
      })
      addToast(`${member.user.name ?? member.user.email} role changed to ${newRole.toLowerCase()}`, "success")
    } catch {
      addToast("Failed to change role", "error")
    }
  }

  const selectedTeam = teams.find((t) => t.id === selectedTeamId)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-2 h-4 w-48" />
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">Team</h1>
          <p className="mt-1 text-sm text-dark-100">Manage your team members and their roles</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-dark-100" />
            <p className="text-lg font-medium text-dark-50">No teams yet</p>
            <p className="mt-1 text-sm text-dark-100">Create a team to start collaborating</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">Team</h1>
          <p className="mt-1 text-sm text-dark-100">Manage your team members and their roles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedTeamId ?? ""}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="flex h-10 appearance-none rounded-lg border border-dark-100 bg-dark-500 px-3 pr-8 text-sm text-dark-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-100" />
          </div>
          <Button variant="primary" onClick={() => setShowInviteDialog(true)} disabled={!canManage}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {selectedTeam && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              {editing ? (
                <div className="flex-1 space-y-3">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Team name"
                  />
                  <Input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Team description (optional)"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Check className="mr-1 h-4 w-4" />}
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                      <X className="mr-1 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle className="text-lg">{selectedTeam.name}</CardTitle>
                    <CardDescription>
                      {team?.teamMembers.length ?? 0} members &middot; {selectedTeam.slug}
                      {selectedTeam.description && <span> &middot; {selectedTeam.description}</span>}
                    </CardDescription>
                  </div>
                  {canManage && (
                    <Button variant="ghost" size="sm" onClick={startEditing}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
              <Badge variant="secondary" className="ml-4 shrink-0 text-xs">
                <Users className="mr-1 h-3 w-3" />
                {team?.teamMembers.length ?? 0}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team?.teamMembers.map((member) => {
                    const role = roleConfig[member.role]
                    const isCurrentUser = member.user.email === currentUserEmail
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              size="sm"
                              fallback={member.user.name ?? member.user.email}
                              src={member.user.image ?? undefined}
                            />
                            <div>
                              <p className="font-medium text-dark-50">
                                {member.user.name ?? "Unnamed"}
                                {isCurrentUser && <span className="ml-2 text-xs text-dark-100">(you)</span>}
                              </p>
                              <p className="text-xs text-dark-100">{member.user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isOwner && member.role !== "OWNER" ? (
                            <select
                              value={member.role}
                              onChange={(e) => handleRoleChange(member, e.target.value as TeamRole)}
                              className="flex h-8 appearance-none rounded-lg border border-dark-100 bg-dark-500 px-2 pr-6 text-sm text-dark-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="MEMBER">Member</option>
                            </select>
                          ) : (
                            <div className={`flex items-center gap-1.5 text-sm font-medium ${role.color}`}>
                              {role.icon}
                              {role.label}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-dark-100 text-nowrap">
                          {formatDate(member.joinedAt, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          {member.role !== "OWNER" ? (
                            <button
                              type="button"
                              onClick={() => setRemoveConfirm(member)}
                              className="rounded-lg p-2 text-dark-100 hover:text-red-400 hover:bg-dark-300 transition-colors"
                              title="Remove member"
                              disabled={!isOwner}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <span className="text-xs text-dark-100">Owner</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showInviteDialog} onOpenChange={(o) => { if (!o) setShowInviteDialog(false) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select
                id="inviteRole"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as TeamRole)}
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleInvite} disabled={inviting}>
                {inviting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!removeConfirm} onOpenChange={(o) => { if (!o) setRemoveConfirm(null) }}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle>Remove Member</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to remove <strong>{removeConfirm?.user.name ?? removeConfirm?.user.email}</strong> from the team?
              They will lose access to all team resources.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setRemoveConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => removeConfirm && handleRemove(removeConfirm)}
              disabled={removing}
            >
              {removing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Remove Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
