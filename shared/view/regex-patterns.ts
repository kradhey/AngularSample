export const patterns = {
    get url() { return "[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)"; },
    get password()  { return "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$"; },
    get phone() { return "^\\(\\d\\d\\d\\)\\s\\d\\d\\d\-\\d\\d\\d\\d$"; },
    get email() { return "^[A-Za-z0-9]+[_A-Za-z0-9\\.-]*[A-Za-z0-9]+@[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,4})$"; },
    get zipCode() { return "^\\d\\d\\d\\d\\d$"; },
    get year() { return "^\\d\\d\\d\\d$"; },
    get imdbId() { return "^\\d{7}$"; },
    get imdb() { return "^(http(s)?:\\/\\/(www|m)\\.imdb\\.com|(www|m)\\.imdb\\.com)\\/name\\/nm\\d{7}\\/?$"; },
    get name() { return "^([A-Za-z]+[\\-\\']?)  "; },
    get fullName() {return "^[^ ][\A-Z\a-z ]*[^0-9 ]{2,}$";}
}