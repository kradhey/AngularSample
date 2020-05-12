declare var $: any;
export class Helpers {
    static setLoading(loading) {
        debugger
        if (loading) {
            $('.preloader-backdrop').css('display', 'block');
        } else {
            $('.preloader-backdrop').css('display', 'none');
     
        }
    }
}
