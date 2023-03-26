import os
from dotenv import load_dotenv

class Settings:
    def __init__(self, envpath):
        # .env ファイルを明示的に指定して環境変数として読み込む
        self.__dotenv_path = envpath
        load_dotenv(self.__dotenv_path)
        # 環境変数から設定値を取得
        self.__channel_access = os.environ.get("CHANNEL_ACCESS_TOKEN")
        self.__channel_secret = os.environ.get("CHANNEL_SECRET")
        self.__liff_base_url = os.environ.get("LIFF_BASE_URL")
        if os.environ.get("FLASK_ENV") == "development":
            self.__google_secret = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        else:
            self.__google_secret = ""

    @property
    def channel_access(self):
        return self.__channel_access

    @property
    def channel_secret(self):
        return self.__channel_secret
    
    @property
    def google_secret(self):
        return self.__google_secret

    @property
    def liff_base_url(self):
        return self.__liff_base_url