with open('prisma/schema.prisma', 'r') as f:
    lines = f.readlines()
print('Total lines:', len(lines))
for i, l in enumerate(lines[903:913], start=904):
    print(str(i) + ': ' + repr(l))
