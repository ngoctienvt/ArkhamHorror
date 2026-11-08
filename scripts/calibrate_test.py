path = 'frontend/tests/hemlockOverview.test.mjs'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_test = '''  assert.deepEqual(hemlockVillagePosition('04068'), [50, 88]) // Chamber of Time
  assert.deepEqual(hemlockVillagePosition('04251'), [35, 85]) // Great Library (Pnakotus)'''

new_test = '''  assert.deepEqual(hemlockVillagePosition('04068'), [50, 84]) // Chamber of Time
  assert.deepEqual(hemlockVillagePosition('04251'), [45, 82]) // Great Library (Pnakotus)'''

if old_test in content:
    content = content.replace(old_test, new_test)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated test file successfully!")
else:
    print("Could not find old_test!")
