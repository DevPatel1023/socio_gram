export default function timeago(dateString){
    if(!dateString) return 'N|A';
    const now = new Date();
    const date = new Date(dateString);
    const diffMS = now - date;

    const secounds = Math.floor(diffMS / 1000);
    const minutes = Math.floor(diffMS / (1000 * 60));
    const hours = Math.floor(diffMS / (1000 * 60 * 60));
    const days = Math.floor(diffMS / (1000 * 60 * 60 * 24));

    if(secounds < 60) return 'just now' ;
    if(minutes < 60) return `${minutes} minutes${minutes !== 1 ? 's' : ''} ago` ;
    if(days < 7) return `${days} day${days !== 1 ? 's' : ''} ago` ;

    return date.toLocaleDateString();
}