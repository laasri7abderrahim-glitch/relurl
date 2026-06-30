"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { formatDate, sanitizeInput } from "@/lib/utils"
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
  Plus,
} from "lucide-react"
import { useTranslations } from "next-intl"

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

export default function TeamPage() {
  const t = useTranslations("dashboard.team")
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
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createName, setCreateName] = useState("")
  const [createSlug, setCreateSlug] = useState("")
  const [createDescription, setCreateDescription] = useState("")
  const [creating, setCreating] = useState(false)
  const { addToast } = useToast()

  const roleConfig: Record<TeamRole, { label: string; icon: React.ReactNode; color: string }> = {
    OWNER: {
      label: t("roles.owner"),
      icon: <Crown className="h-4 w-4" />,
      color: "text-yellow-400",
    },
    ADMIN: {
      label: t("roles.admin"),
      icon: <ShieldCheck className="h-4 w-4" />,
      color: "text-blue-400",
    },
    MEMBER: {
      label: t("roles.member"),
      icon: <Shield className="h-4 w-4" />,
      color: "text-dark-100",
    },
  }

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
        addToast(t("toast.loadFailed"), "error")
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [addToast, t])

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
        addToast(t("toast.loadDetailsFailed"), "error")
      } finally {
        setMembersLoading(false)
      }
    }
    fetchTeam()
  }, [selectedTeamId, addToast, t])

  function startEditing() {
    if (!team) return
    setEditName(team.name)
    setEditDescription(team.description ?? "")
    setEditing(true)
  }

  async function handleSave() {
    if (!team) return
    if (!editName.trim()) {
      addToast(t("toast.nameRequired"), "error")
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
      addToast(t("toast.updateSuccess"), "success")
    } catch {
      addToast(t("toast.updateFailed"), "error")
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
      addToast(t("toast.emailRequired"), "error")
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
      addToast(t("toast.inviteSent", { email: inviteEmail }), "success")
      setShowInviteDialog(false)
      setInviteEmail("")
      setInviteRole("MEMBER")
    } catch {
      addToast(t("toast.inviteFailed"), "error")
    } finally {
      setInviting(false)
    }
  }

  function generateSlugFromName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  function handleCreateNameChange(name: string) {
    setCreateName(name)
    const autoSlug = generateSlugFromName(name)
    if (!createSlug || createSlug === generateSlugFromName(createName)) {
      setCreateSlug(autoSlug)
    }
  }

  async function handleCreateTeam() {
    if (!createName.trim()) {
      addToast(t("toast.nameRequired"), "error")
      return
    }
    if (!createSlug.trim()) {
      addToast(t("toast.slugRequired"), "error")
      return
    }
    setCreating(true)
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitizeInput(createName.trim()),
          slug: sanitizeInput(createSlug.trim()),
          description: createDescription.trim() ? sanitizeInput(createDescription.trim()) : undefined,
        }),
      })
      const json = await res.json()
      if (json.error) {
        addToast(json.error, "error")
        return
      }
      setShowCreateDialog(false)
      setCreateName("")
      setCreateSlug("")
      setCreateDescription("")
      addToast(t("toast.createSuccess"), "success")
      const res2 = await fetch("/api/teams?limit=50")
      const json2 = await res2.json()
      if (!json2.error) {
        setTeams(json2.data.teams)
        setSelectedTeamId(json.data.id)
      }
    } catch {
      addToast(t("toast.createFailed"), "error")
    } finally {
      setCreating(false)
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
      addToast(t("toast.removeSuccess", { name: member.user.name ?? member.user.email }), "success")
      setRemoveConfirm(null)
    } catch {
      addToast(t("toast.removeFailed"), "error")
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
      addToast(t("toast.roleChanged", { name: member.user.name ?? member.user.email, role: t("roles." + newRole.toLowerCase()) }), "success")
    } catch {
      addToast(t("toast.roleChangeFailed"), "error")
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
          <div className="text-2xl font-bold text-dark-50">{t("title")}</div>
          <p className="mt-1 text-sm text-dark-100">{t("description")}</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-dark-100" />
            <p className="text-lg font-medium text-dark-50">{t("empty.title")}</p>
            <p className="mt-1 text-sm text-dark-100">{t("empty.description")}</p>
            <Button variant="primary" className="mt-6" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("createTeam")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">{t("title")}</h1>
          <p className="mt-1 text-sm text-dark-100">{t("description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedTeamId ?? ""}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="flex h-10 appearance-none rounded-lg border border-dark-100 bg-dark-500 px-3 pr-8 text-sm text-dark-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {teams.map((tm) => (
                <option key={tm.id} value={tm.id}>
                  {tm.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-100" />
          </div>
          <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("createTeam")}
          </Button>
          <Button variant="primary" onClick={() => setShowInviteDialog(true)} disabled={!canManage}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("inviteMember")}
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
                    placeholder={t("editTeamName")}
                  />
                  <Input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder={t("editTeamDescription")}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Check className="mr-1 h-4 w-4" />}
                      {t("save")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                      <X className="mr-1 h-4 w-4" />
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle className="text-lg">{selectedTeam.name}</CardTitle>
                    <CardDescription>
                      {t("membersCount", { count: team?.teamMembers.length ?? 0 })} &middot; {selectedTeam.slug}
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
                    <TableHead>{t("table.member")}</TableHead>
                    <TableHead>{t("table.role")}</TableHead>
                    <TableHead>{t("table.joined")}</TableHead>
                    <TableHead className="text-right">{t("table.actions")}</TableHead>
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
                                {member.user.name ?? t("unnamed")}
                                {isCurrentUser && <span className="ml-2 text-xs text-dark-100">{t("you")}</span>}
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
                              <option value="ADMIN">{t("roles.admin")}</option>
                              <option value="MEMBER">{t("roles.member")}</option>
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
                              title={t("removeMemberTitle")}
                              disabled={!isOwner}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <span className="text-xs text-dark-100">{t("owner")}</span>
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
            <DialogTitle>{t("inviteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("inviteDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">{t("inviteDialog.emailLabel")}</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder={t("inviteDialog.emailPlaceholder")}
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">{t("inviteDialog.roleLabel")}</Label>
              <Select
                id="inviteRole"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as TeamRole)}
              >
                <option value="MEMBER">{t("roles.member")}</option>
                <option value="ADMIN">{t("roles.admin")}</option>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                {t("inviteDialog.cancel")}
              </Button>
              <Button variant="primary" onClick={handleInvite} disabled={inviting}>
                {inviting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {t("inviteDialog.send")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateDialog} onOpenChange={(o) => { if (!o) { setShowCreateDialog(false); setCreateName(""); setCreateSlug(""); setCreateDescription("") } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createDialog.title")}</DialogTitle>
            <DialogDescription>{t("createDialog.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="createName">{t("createDialog.nameLabel")}</Label>
              <Input
                id="createName"
                placeholder={t("createDialog.namePlaceholder")}
                value={createName}
                onChange={(e) => handleCreateNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createSlug">{t("createDialog.slugLabel")}</Label>
              <Input
                id="createSlug"
                placeholder={t("createDialog.slugPlaceholder")}
                value={createSlug}
                onChange={(e) => setCreateSlug(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createDescription">{t("createDialog.descriptionLabel")}</Label>
              <Textarea
                id="createDescription"
                placeholder={t("createDialog.descriptionPlaceholder")}
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => { setShowCreateDialog(false); setCreateName(""); setCreateSlug(""); setCreateDescription("") }}>
                {t("createDialog.cancel")}
              </Button>
              <Button variant="primary" onClick={handleCreateTeam} disabled={creating}>
                {creating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {t("createDialog.create")}
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
              <DialogTitle>{t("removeDialog.title")}</DialogTitle>
            </div>
            <DialogDescription>
              {t("removeDialog.desc1")} <strong>{removeConfirm?.user.name ?? removeConfirm?.user.email}</strong> {t("removeDialog.desc2")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setRemoveConfirm(null)}>
              {t("removeDialog.cancel")}
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
              {t("removeDialog.remove")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}