class User:
    def __init__(self, id="", line_id="", name="", picture_url="",  group_ids=None, session_id="", joining_group=""):
        if group_ids == None:
            group_ids = []
        self.__id = id
        self.__line_id = line_id
        self.__session_id = session_id
        self.__name = name
        self.__picture_url = picture_url
        self.__group_ids = group_ids
        self.__joining_group = joining_group

    
    @property
    def id(self):
        return self.__id
    @id.setter
    def id(self, id):
        self.__id = id
    
    @property
    def line_id(self):
        return self.__line_id
    @line_id.setter
    def line_id(self, line_id):
        self.__line_id = line_id

    @property
    def session_id(self):
        return self.__session_id
    @session_id.setter
    def session_id(self, session_id):
        self.__session_id = session_id

    @property
    def name(self):
        return self.__name
    @name.setter
    def name(self, name):
        self.__name = name

    @property
    def picture_url(self):
        return self.__picture_url
    @picture_url.setter
    def picture_url(self, picture_url):
        self.__picture_url = picture_url
    
    @property
    def group_ids(self):
        return self.__group_ids
    @group_ids.setter
    def group_ids(self, group_ids):
        self.__group_ids = group_ids

    @property
    def joining_group(self):
        return self.__joining_group
    @joining_group.setter
    def joining_group(self, joining_group):
        self.__joining_group = joining_group
    
    @staticmethod
    def from_dict(source):
        user = User(**source)
        return user

    def to_dict(self):
        dest = { 
            u'id': self.id,
            u'line_id': self.line_id,
            u'session_id': self.session_id,
            u'name': self.name,
            u'picture_url': self.picture_url,
            u'group_ids': self.group_ids,
            u'joining_group': self.joining_group
        }
        return dest

    def __repr__(self):
        return(
            f'User(\
                id={self.id}, \
                line_id={self.line_id}, \
                session_id={self.session_id}, \
                name={self.name}, \
                picture_url={self.picture_url}, \
                group_ids={self.group_ids}, \
                joining_group={self.joining_group} \
            )'
        )