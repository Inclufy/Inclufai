// [Copy the ENTIRE original file content here, but replace the menuItems.map section with:]

{menuItems.map((item) => {
  const isLocked = isItemLocked(item.feature);
  const isActive = location.pathname === item.url || 
                   (item.isProgramLink && isProgramContext);

  return (
    <SidebarMenuItem key={item.url}>
      <SidebarMenuButton 
        asChild
        tooltip={isLocked ? "🔒 Upgrade Required" : item.title}
        className={cn(
          isLocked && "opacity-60 hover:opacity-80"
        )}
      >
        <NavLink
          to={item.url}
          end={item.isProgramLink ? !isProgramContext : true}
          onClick={(e) => {
            if (isLocked) {
              e.preventDefault();
              toast({
                title: "🔒 Upgrade Required",
                description: `${item.title} is available with a paid subscription.`,
                action: (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/pricing')}
                  >
                    View Plans
                  </Button>
                ),
              });
            }
          }}
          className={({ isActive: navIsActive }) =>
            cn(
              "flex items-center gap-3",
              (navIsActive || isActive)
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
              isLocked && "cursor-not-allowed"
            )
          }
        >
          <item.icon className={cn(
            "h-4 w-4",
            isLocked && "text-muted-foreground"
          )} />
          {!isCollapsed && (
            <span className={cn(
              isLocked && "text-muted-foreground"
            )}>
              {item.title}
            </span>
          )}
          {isLocked && !isCollapsed && (
            <Lock className="ml-auto h-4 w-4 text-muted-foreground" />
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
})}
