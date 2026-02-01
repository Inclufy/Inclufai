file_path = 'views.py.broken'

with open(file_path, 'r') as f:
    content = f.read()

# Fix the broken line by adding newlines
content = content.replace(
    'return Response(data, status=status.HTTP_200_OK)    def post(self, request):',
    '''return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request):'''
)

# Fix all the other squished parts
content = content.replace('):        ', '):\n        ')
content = content.replace('        if ', '\n        if ')
content = content.replace('        name = ', '\n        name = ')
content = content.replace('        description = ', '\n        description = ')
content = content.replace('        company = ', '\n        company = ')
content = content.replace('        return Response', '\n        return Response')
content = content.replace('        )        return', '        )\n        return')

with open('views.py.fixed', 'w') as f:
    f.write(content)

print("✓ Fixed file saved as views.py.fixed")
