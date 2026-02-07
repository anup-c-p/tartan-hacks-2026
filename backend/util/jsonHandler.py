import json

class Store:
    """
    Simple in-memory store model using dicts/lists for convenience.
    - menu categories: dict {category_id: {"name": str, "items": dict {item_id: item_dict}}}
    - photos: dict {photo_id: photo_dict}
    - hours: dict {"timezone": str, "regular": dict{day: {...}}, "special": dict{date: {...}}}
    """

    def __init__(self, storeId: str, ownerId: str, timezone: str = "America/Chicago"):
        self.storeId = storeId
        self.ownerId = ownerId

        # Info
        self.name = ""
        self.description = ""
        self.type = ""  # e.g. "restaurant"
        self.categories = []  # list[str]
        self.tags = []        # list[str]
        self.priceRange = ""  # e.g. "$$"

        # Contact
        self.phone = ""
        self.email = ""

        # Location (simple)
        self.location = {
            "addressLine1": "",
            "addressLine2": "",
            "city": "",
            "state": "",
            "zip": "",
            "country": "US",
            "coordinates": {"lat": None, "lng": None},
            "directionsNote": ""
        }

        # Menu storage
        self.menu = {
            "currency": "USD",
            "categories": {}  # categoryId -> {"name": str, "items": {itemId: itemDict}}
        }

        # Photos storage
        self.photos = {}  # photoId -> {"url": str, "type": str, "caption": str}

        # Hours storage
        self.hours = {
            "timezone": timezone,
            "regular": {
                "monday":    {"closed": True},
                "tuesday":   {"closed": True},
                "wednesday": {"closed": True},
                "thursday":  {"closed": True},
                "friday":    {"closed": True},
                "saturday":  {"closed": True},
                "sunday":    {"closed": True},
            },
            "special": {}  # date "YYYY-MM-DD" -> {"closed": bool, "open": str?, "close": str?, "note": str?}
        }

    # -----------------
    # Basic info edits
    # -----------------
    def editName(self, name: str):
        self.name = name

    def editDescription(self, description: str):
        self.description = description

    def editType(self, store_type: str):
        self.type = store_type

    def editCategories(self, categories: list):
        self.categories = list(categories) if categories is not None else []

    def editTags(self, tags: list):
        self.tags = list(tags) if tags is not None else []

    def editPriceRange(self, priceRange: str):
        self.priceRange = priceRange

    # -------------
    # Contact edits
    # -------------
    def editPhone(self, phone: str):
        self.phone = phone

    def editEmail(self, email: str):
        self.email = email

    # --------------
    # Location edits
    # --------------
    def editLocation(
        self,
        addressLine1: str,
        city: str,
        state: str,
        zip_code: str,
        country: str = "US",
        addressLine2: str = "",
        lat=None,
        lng=None,
        directionsNote: str = ""
    ):
        self.location["addressLine1"] = addressLine1
        self.location["addressLine2"] = addressLine2
        self.location["city"] = city
        self.location["state"] = state
        self.location["zip"] = zip_code
        self.location["country"] = country
        self.location["coordinates"]["lat"] = lat
        self.location["coordinates"]["lng"] = lng
        self.location["directionsNote"] = directionsNote

    # --------------
    # Menu categories
    # --------------
    def addMenuCategory(self, categoryId: str, name: str):
        if categoryId in self.menu["categories"]:
            raise ValueError(f"Category '{categoryId}' already exists")
        self.menu["categories"][categoryId] = {"name": name, "items": {}}

    def editMenuCategory(self, categoryId: str, name: str):
        if categoryId not in self.menu["categories"]:
            raise ValueError(f"Category '{categoryId}' not found")
        self.menu["categories"][categoryId]["name"] = name

    def removeMenuCategory(self, categoryId: str):
        if categoryId not in self.menu["categories"]:
            raise ValueError(f"Category '{categoryId}' not found")
        del self.menu["categories"][categoryId]

    # ----------
    # Menu items
    # ----------
    def addMenuItem(
        self,
        CategoryID: str,
        item: dict
    ):
        """
        item must include:
          - id (str)
          - name (str)
          - price (number)
        optional:
          - description (str="")
          - image (photoId or "")
        """
        if CategoryID not in self.menu["categories"]:
            raise ValueError(f"Category '{CategoryID}' not found")

        item_id = item.get("id")
        if not item_id:
            raise ValueError("item must include 'id'")

        # defaults
        item.setdefault("description", "")
        item.setdefault("image", "")

        items = self.menu["categories"][CategoryID]["items"]
        if item_id in items:
            raise ValueError(f"Item '{item_id}' already exists in category '{CategoryID}'")

        items[item_id] = item

    def editMenuItem(
        self,
        CategoryID: str,
        item: dict
    ):
        """
        item must include 'id'. Any provided keys overwrite existing fields.
        """
        if CategoryID not in self.menu["categories"]:
            raise ValueError(f"Category '{CategoryID}' not found")

        item_id = item.get("id")
        if not item_id:
            raise ValueError("item must include 'id'")

        items = self.menu["categories"][CategoryID]["items"]
        if item_id not in items:
            raise ValueError(f"Item '{item_id}' not found in category '{CategoryID}'")

        items[item_id].update(item)

    def removeMenuItem(self, CategoryID: str, item):
        """
        item can be:
          - item_id (str), or
          - item dict containing {"id": "..."}
        """
        if CategoryID not in self.menu["categories"]:
            raise ValueError(f"Category '{CategoryID}' not found")

        item_id = item if isinstance(item, str) else item.get("id")
        if not item_id:
            raise ValueError("removeMenuItem requires item_id (str) or item dict with 'id'")

        items = self.menu["categories"][CategoryID]["items"]
        if item_id not in items:
            raise ValueError(f"Item '{item_id}' not found in category '{CategoryID}'")

        del items[item_id]

    # -------
    # Photos
    # -------
    def addPhoto(self, photoId: str, url: str, photoType: str, caption: str = ""):
        if photoId in self.photos:
            raise ValueError(f"Photo '{photoId}' already exists")
        self.photos[photoId] = {"url": url, "type": photoType, "caption": caption}

    def editPhoto(self, photoId: str, url: str = None, photoType: str = None, caption: str = None):
        if photoId not in self.photos:
            raise ValueError(f"Photo '{photoId}' not found")
        if url is not None:
            self.photos[photoId]["url"] = url
        if photoType is not None:
            self.photos[photoId]["type"] = photoType
        if caption is not None:
            self.photos[photoId]["caption"] = caption

    def removePhoto(self, photoId: str):
        if photoId not in self.photos:
            raise ValueError(f"Photo '{photoId}' not found")
        del self.photos[photoId]

        # Optional convenience: clear menu item image references to deleted photo
        for cat in self.menu["categories"].values():
            for it in cat["items"].values():
                if it.get("image") == photoId:
                    it["image"] = ""

    # ------
    # Hours
    # ------
    def editHours(self, Day: str, open: str = None, close: str = None):
        """
        If open/close are provided -> sets open/close and marks not closed.
        If open is None and close is None -> marks closed.
        """
        day = Day.lower()
        if day not in self.hours["regular"]:
            raise ValueError(f"Invalid day '{Day}'")

        if open is None and close is None:
            self.hours["regular"][day] = {"closed": True}
        else:
            if open is None or close is None:
                raise ValueError("Both open and close must be provided, or neither to mark closed")
            self.hours["regular"][day] = {"open": open, "close": close}

    def addSpecialHours(self, date: str, closed: bool = True, open: str = None, close: str = None, note: str = ""):
        """
        date: "YYYY-MM-DD"
        Defaults to closed=True.
        If closed=False, provide open and close.
        """
        if date in self.hours["special"]:
            raise ValueError(f"Special hours for '{date}' already exist")

        entry = {"date": date}
        if closed:
            entry["closed"] = True
        else:
            if open is None or close is None:
                raise ValueError("open and close required when closed=False")
            entry["open"] = open
            entry["close"] = close

        if note:
            entry["note"] = note

        self.hours["special"][date] = entry

    def editSpecialHours(self, date: str, closed: bool = None, open: str = None, close: str = None, note: str = None):
        """
        Patch special hours entry. You can switch between closed/open-close.
        """
        if date not in self.hours["special"]:
            raise ValueError(f"Special hours for '{date}' not found")

        entry = self.hours["special"][date]

        if closed is not None:
            if closed:
                entry.pop("open", None)
                entry.pop("close", None)
                entry["closed"] = True
            else:
                if open is None or close is None:
                    raise ValueError("open and close required when setting closed=False")
                entry.pop("closed", None)
                entry["open"] = open
                entry["close"] = close

        # If user provides open/close without specifying closed, just set them
        if open is not None or close is not None:
            if open is None or close is None:
                raise ValueError("Both open and close must be provided together")
            entry.pop("closed", None)
            entry["open"] = open
            entry["close"] = close

        if note is not None:
            if note == "":
                entry.pop("note", None)
            else:
                entry["note"] = note

    def removeSpecialHours(self, date: str):
        if date not in self.hours["special"]:
            raise ValueError(f"Special hours for '{date}' not found")
        del self.hours["special"][date]

    # ------------
    # Export JSON
    # ------------
    def to_dict(self) -> dict:
        """Return a JSON-serializable dict matching your original structure."""
        # Turn photos dict -> list of dicts
        photos_list = [{"id": pid, **pdata} for pid, pdata in self.photos.items()]

        # Turn categories dict -> list of dicts with items list
        categories_list = []
        for cid, cdata in self.menu["categories"].items():
            items_list = list(cdata["items"].values())
            categories_list.append({"id": cid, "name": cdata["name"], "items": items_list})

        return {
            "storeId": self.storeId,
            "ownerId": self.ownerId,
            "info": {
                "name": self.name,
                "description": self.description,
                "type": self.type,
                "categories": self.categories,
                "tags": self.tags,
                "priceRange": self.priceRange
            },
            "contact": {
                "phone": self.phone,
                "email": self.email
            },
            "location": self.location,
            "menu": {
                "currency": self.menu["currency"],
                "categories": categories_list
            },
            "photos": photos_list,
            "hours": {
                "timezone": self.hours["timezone"],
                "regular": self.hours["regular"],
                "special": list(self.hours["special"].values())
            }
        }
    
    # ------------
    # Import JSON
    # ------------
    def loadFromJSON(self, data):
        """
        Load from:
          - filepath string
          OR
          - already-loaded dict

        Overwrites current values with JSON contents.
        """

        # Allow file path or dict
        if isinstance(data, str):
            with open(data, "r") as f:
                data = json.load(f)

        # ---- basic ----
        self.storeId = data.get("storeId", self.storeId)
        self.ownerId = data.get("ownerId", self.ownerId)

        info = data.get("info", {})
        self.name = info.get("name", "")
        self.description = info.get("description", "")
        self.type = info.get("type", "")
        self.categories = info.get("categories", [])
        self.tags = info.get("tags", [])
        self.priceRange = info.get("priceRange", "")

        # ---- contact ----
        contact = data.get("contact", {})
        self.phone = contact.get("phone", "")
        self.email = contact.get("email", "")

        # ---- location ----
        self.location = data.get("location", self.location)

        # ---- photos ----
        self.photos = {}
        for p in data.get("photos", []):
            self.photos[p["id"]] = {
                "url": p.get("url", ""),
                "type": p.get("type", ""),
                "caption": p.get("caption", "")
            }

        # ---- menu ----
        self.menu["categories"] = {}
        for cat in data.get("menu", {}).get("categories", []):
            cid = cat["id"]
            self.menu["categories"][cid] = {
                "name": cat.get("name", ""),
                "items": {}
            }

            for item in cat.get("items", []):
                self.menu["categories"][cid]["items"][item["id"]] = item

        # ---- hours ----
        hours = data.get("hours", {})
        self.hours["timezone"] = hours.get("timezone", self.hours["timezone"])
        self.hours["regular"] = hours.get("regular", self.hours["regular"])

        self.hours["special"] = {}
        for s in hours.get("special", []):
            self.hours["special"][s["date"]] = s
