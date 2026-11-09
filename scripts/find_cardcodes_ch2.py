import glob, os, re

files = glob.glob('backend/arkham-api/library/Arkham/Location/CardDefs/**/*.hs', recursive=True)

var_to_card = {}
for f in files:
    with open(f, 'r', encoding='utf-8') as fl:
        txt = fl.read()
    # Match varName = ... "CardCode" "Title"
    matches = re.findall(r'(\w+)\s*=\s*(?:[^\n]+\n)*?\s*(?:location|locationWith[a-zA-Z_]*)\s*(?:[$\(].*?)?"(\d{5}[a-z]?)"\s*(?:\("([^"]+)"\s*<:>\s*"([^"]+)"\)|\"([^\"]+)\")', txt)
    for m in matches:
        var_name = m[0]
        code = m[1]
        sub1 = m[2]
        sub2 = m[3]
        title = m[4]
        full_title = f"{sub1}: {sub2}" if sub1 else title
        var_to_card[var_name] = (code, full_title, os.path.basename(f))

# Let's check each scenario
scenarios_refs = {
    'Spreading Flames': ['dormitories', 'miskatonicQuad', 'orneLibrary', 'scienceHall', 'warrenObservatory', 'yourFriendsRoom'],
    'Smoke and Mirrors': ['downtownArkhamSanatorium', 'downtownFirstBankOfArkham_Arkham', 'easttown', 'frenchHill', 'merchantDistrict', 'miskatonicUniversityInFlames', 'miskatonicUniversityQuietCampus', 'northside', 'southside', 'uptownStMarysHospital', 'uptownYeOldeMagickShoppe', 'waterfrontDistrict'],
    'Queen of Ash': ['sewerCulvert', 'sewerTunnelsFloodedCrypt', 'sewerTunnelsInfestedPipes', 'sewerTunnelsOvergrownTunnels', 'sewerTunnelsSmugglersCache', 'sewerTunnelsToxicWastePit', 'sluiceControl', 'undergroundCistern'],
    'River of Blood': ['backAlleyDawn', 'backAlleyDusk', 'erwinBridgeDawn', 'erwinBridgeDusk', 'garrisonStreetDawn', 'garrisonStreetDusk', 'mainStreetDawn', 'mainStreetDusk', 'riverDocksDawn', 'riverDocksDusk', 'unvisitedIsleDawn', 'unvisitedIsleDusk', 'waterStreetDawn', 'waterStreetDusk', 'waterfrontWarehouseDawn', 'waterfrontWarehouseDusk'],
    'New Horizons': ['cavernEntranceDarkestDepths', 'cavernEntranceShallowTunnels', 'descendingTunnel', 'factoryFloorEastDay', 'factoryFloorEastNight', 'factoryFloorWestDay', 'factoryFloorWestNight', 'hiddenLaboratoryDarkestDepths', 'hiddenLaboratoryShallowTunnels', 'loadingDockDay', 'loadingDockNight', 'lockedChamberDarkestDepths', 'lockedChamberShallowTunnels', 'managersOfficeDay', 'managersOfficeNight', 'secretChamberDarkestDepths', 'secretChamberShallowTunnels', 'storageDay', 'storageNight'],
    'Blood Money': ['balcony', 'diningHall', 'foyerBoringParty', 'kitchen', 'masterBedroom', 'office', 'study'],
    'Traces to Nowhere': ['arkhamAdvertiser', 'bonePit', 'duterteFuneralHomeAfterHours', 'duterteFuneralHomeSomethingInTheBasement', 'frenchHill', 'historicalSociety', 'meigerEstateBeyondTheBlackDoor', 'meigerEstateUnderNewOwnership', 'merchantDistrict', 'southChurch', 'steersOffice', 'tickTockClub', 'trainStation'],
}

for sname, refs in scenarios_refs.items():
    print(f"\n=== {sname} ===")
    for r in refs:
        if r in var_to_card:
            code, title, fn = var_to_card[r]
            print(f"  '{code}': {title} ({r})")
        else:
            # Search in all text files
            found = False
            for f in files:
                with open(f, 'r', encoding='utf-8') as fl:
                    txt = fl.read()
                if f"{r} = " in txt or f"{r} ::" in txt:
                    c = re.findall(r'"(\d{5}[a-z]?)"', txt[txt.find(r):txt.find(r)+300])
                    print(f"  [Found in {os.path.basename(f)}] {r} -> {c}")
                    found = True
                    break
            if not found:
                print(f"  [NOT FOUND] {r}")
