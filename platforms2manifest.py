import json


def print_manifest_values(path):
    with open(path) as f:
        platforms = json.load(f)

    hosts = []
    web_accessible_matches = []
    block_legacy = ["7fef97eb-a5cc-4caa-8d19-75dab7407b6b", "98ea82db-9d50-4951-935e-2405d9fe892e"]
    for platform in platforms:
        for site in platform["sites"]:
            if site["origin"] not in web_accessible_matches:
                web_accessible_matches.append(site["origin"])
            if site["id"] in block_legacy:
                continue
            if site["origin"] not in hosts:
                hosts.append(site["origin"])

    print("HOSTS")
    print(json.dumps(hosts))
    print("")
    print("")
    print("web_accessible_matches")
    print(json.dumps(web_accessible_matches))

print("CANDIDATES\n\n\n")
print(print_manifest_values('candidates/platforms.json'))

print("\n\n\nPRODUCTION")
print(print_manifest_values('public/platforms.json'))
