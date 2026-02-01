# Add Settings Link to AppHeader

In App.tsx, update the AppHeader component to include Settings link:
```typescript
// In AppHeader component, replace the user dropdown with:
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm" className="gap-2">
      <User className="h-4 w-4" />
      {user && <span className="hidden sm:inline">{user.email}</span>}
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuItem onClick={() => navigate('/settings')}>
      <Settings className="h-4 w-4 mr-2" />
      Settings
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => navigate('/settings/2fa')}>
      <Shield className="h-4 w-4 mr-2" />
      Two-Factor Auth
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={logout}>
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```
