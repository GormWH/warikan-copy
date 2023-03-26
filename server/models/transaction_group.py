class TransactionGroup:
    def __init__(self,
                 id='',
                 name="", 
                 description="", 
                 transaction_ids=[], 
                 user_ids=[],
                 approved_user_ids=[],
                 all_approved=False,
                 status=''):
        self.__id = id
        self.__name = name
        self.__description = description
        self.__transaction_ids = transaction_ids
        self.__user_ids = user_ids
        self._approved_user_ids = approved_user_ids
        self._all_approved = all_approved
        self._status = status

    @property
    def id(self):
        return self.__id

    @id.setter
    def id(self, id):
        self.__id = id
    
    @property
    def name(self):
        return self.__name

    @name.setter
    def name(self, name):
        self.__name = name

    @property
    def description(self):
        return self.__description

    @description.setter
    def description(self, description):
        self.__description = description
    
    @property
    def transaction_ids(self):
        return self.__transaction_ids

    @transaction_ids.setter
    def transaction_ids(self, transaction_ids):
        self.__transaction_ids = transaction_ids
    
    @property
    def user_ids(self):
        return self.__user_ids

    @user_ids.setter
    def user_ids(self, user_ids):
        self.__user_ids = user_ids
    
    @property
    def approved_user_ids(self):
        return self._approved_user_ids
    
    @approved_user_ids.setter
    def approved_user_ids(self, approved_user_ids):
        self._approved_user_ids = approved_user_ids
    
    @property
    def all_approved(self):
        return self._all_approved
    
    @all_approved.setter
    def all_approved(self, all_approved):
        self._all_approved = all_approved

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, status):
        self._status = status

    @staticmethod
    def from_dict(source):
        transaction_group = TransactionGroup(**source)
        # group = TransactionGroup(source[u'name'], 
        #                         source[u'description'])
        
        # if u'id' in source:
        #     group.id = source[u'id']
        
        # if u'transaction_ids' in source:
        #     group.transaction_ids = source[u'transaction_ids']
        
        # if u'user_ids' in source:
        #     group.user_ids = source[u'user_ids']
        return transaction_group

    def to_dict(self):
        _dict = {
            'id': self.__id,
            'name': self.__name,
            'description': self.__description,
            'transaction_ids': self.__transaction_ids,
            'user_ids': self.__user_ids,
            'approved_user_ids': self._approved_user_ids,
            'all_approved': self._all_approved,
            'status': self._status
        }
        # dest = { 
        #     u'id': self.id,
        #     u'name': self.name,
        #     u'description': self.description,
        #     u'transaction_ids': self.transaction_ids,
        #     u'user_ids': self.user_ids
        # }
        return _dict

    def __repr__(self):
        return(
            f'TransactionGroup(\
                id={self.id}, \
                name={self.name}, \
                description={self.description}, \
                transaction_ids={self.transaction_ids}, \
                user_ids={self.user_ids} \
            )'
        )