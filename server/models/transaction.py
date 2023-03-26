class Transaction:
    def __init__(self,
                 id=None,
                 name=None,
                 description=None,
                 lenders=None,
                 debtors=None,
                 payment=None,
                 group_id=None,
                 approved_user_ids=None,
                 user_id=None,
                 equal=None,
                 all_approved=False):
        
        if approved_user_ids==None:
            approved_user_ids = []
        self.user_id = user_id
        
        self._id = id
        self._name = name
        self._description = description
        self._lenders = lenders
        self._debtors = debtors
        self._payment = payment
        self._group_id = group_id
        self.equal = equal
        self._approved_user_ids = approved_user_ids
        self._all_approved = all_approved

        
    @property
    def id(self):
        return self._id
    @id.setter
    def id(self, id):
        self._id = id
    
    @property
    def name(self):
        return self._name
    @name.setter
    def name(self, name):
        self._name = name

    @property
    def description(self):
        return self._description
    @description.setter
    def description(self, description):
        self._description = description
    
    @property
    def lenders(self):
        return self._lenders
    @lenders.setter
    def lenders(self, lenders):
        self._lenders = lenders
    
    @property
    def debtors(self):
        return self._debtors
    @debtors.setter
    def debtors(self, debtors):
        self._debtors = debtors
    
    @property
    def payment(self):
        return self._payment
    @payment.setter
    def payment(self, payment):
        self._payment = payment

    @property
    def group_id(self):
        return self._group_id
    @group_id.setter
    def group_id(self, group_id):
        self._group_id = group_id

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


    @staticmethod
    def from_dict(source):
        transaction = Transaction(**source)
        # transaction = Transaction()
        # if u'id' in source:
        #     transaction.id = source[u'id']
        # if u'name' in source:
        #     transaction.name = source[u'name']
        # if u'description' in source:
        #     transaction.description = source[u'description']
        # if u'lenders' in source:
        #     transaction.lenders = source[u'lenders']
        # if u'debtors' in source:
        #     transaction.debtors = source[u'debtors']
        # if u'payment' in source:
        #     transaction.payment = source[u'payment']
        # if u'group_id' in source:
        #     transaction.group_id = source[u'group_id']
        return transaction

    def to_dict(self):
        dest = { 
            u'id': self._id,
            u'name': self._name,
            u'description': self._description,
            u'lenders': self._lenders,
            u'debtors': self._debtors,
            u'payment': self._payment,
            u'group_id': self._group_id,
            u'approved_user_ids': self._approved_user_ids,
            u'all_approved': self._all_approved
        }
        return dest

    def __repr__(self):
        return f"Transaction(\
                id={self._id}, \
                name={self._name}, \
                description={self._description}, \
                lender_ids={self._lenders}, \
                debtor_ids={self._debtors}, \
                payment={self._payment}, \
                group_id={self._group_id}, \
                approved_user_ids={self._approved_user_ids}, \
                all_approved={self._all_approved} \
            )"
        # return(
        #     f'Transaction(\
        #         name={self._name}, \
        #         description={self._description}, \
        #     )'
        # )
