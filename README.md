## Semanggi Back Office

### Installation

- Clone the repo
- add next.config.js inside the destination folder

---

##### SETUP APPLICATION ON DEVELOPMENT OR PRODUCTION MODE

```sh
pm2 delete --silent dashboard-{environment mode}
pm2 start -n dashboard-{environment mode} --silent npm -- run start && pm2 log dashboard-{environment mode}
```