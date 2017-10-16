import fetch from "node-fetch";
interface ICoverPhotoField {

}
interface IUserField {

}
interface IPageField {

}
interface IGroupField {

}
interface IAppField {

}
interface IGroup {
    id: string; // The group ID
    cover: ICoverPhotoField; // Information about the group's cover photo.
    description: string; // A brief description of the group.
    email: string; // The email address to upload content to the group.Only current members of the group can use this.
    icon: string; // The URL for the group's icon.
    member_request_count: number // Integer. The number of pending member requests.If the token is for an administrator, this is the total number of outstanding requests.If the token is for a group member, this will return the number of friends who have requested membership and also use the same app that is making the request.
    name: string; // The name of the group.
    owner: IUserField | IPageField; // The profile that created this group.
    parent: IGroupField | IPageField | IAppField; // The parent of this group, if it exists.
    privacy: "CLOSED" | "OPEN" | "SECRET"; // The privacy setting of the group.
    updated_time: string;// Datetime. The last time the group was updated (this includes changes in the group's properties and changes in posts and comments if the session user can see them).
}
type GroupFields = keyof IGroup;
interface IResource<P, F, O> {
    get(params?: P & {
        fields?: F[];
    }): Promise<O>;

}
interface IEdgesResource<P, F, O> extends IResource<P, F, IEdges<O>> {
    read(params?: P & { fields?: F[] }): AsyncIterableIterator<O>;
}

interface IGroupFeedParams {
    since?: Date;
    until?: Date;
}
interface IGroupEdges {
    // admins
    // albums
    // docs
    // events
    feed(): IGroupFeedResource; // The feed of posts including status updates and links published to this group.
    // files
    // live_videos
    // members
    // photos
    // videos
}
interface IGroupResource extends IResource<any, IGroupField, IGroup>, IGroupEdges {

}
interface IEdges<T> extends Array<T> {
    next(): Promise<IEdges<T>>;
    previous(): Promise<IEdges<T>>;
}
interface IGroupFeedResource extends IEdgesResource<any, PostFields, IPost> {

}
interface IProfileField {
    id: string;
    name: string;
}
interface IPlaceField {

}
type PostFields = keyof IPost;
interface IPost {
    id: string; // The post ID
    admin_creator: any[]; // object[]. ID of admin, app or business that created the post. Applies to pages only
    application: IAppField; // Information about the app this post was published by.
    call_to_action: any; // The call to action type used in any Page posts for mobile app engagement ads.
    caption: string; // The caption of a link in the post (appears beneath the name).
    created_time: string; // datetime. The time the post was initially published. For a post about a life event, this will be the date and time of the life event
    description: string; // A description of a link in the post (appears beneath the caption).
    feed_targeting: any; // Object that controls news feed targeting for this post. Anyone in these groups will be more likely to see this post, others will be less likely, but may still see it anyway. Any of the targeting fields shown here can be used, none are required (applies to Pages only).
    from: IProfileField; // Information about the profile that posted the message.
    icon: string; // A link to an icon representing the type of this post.
    instagram_eligibility: string; // Whether the post can be promoted on Instagram. It returns the enum "eligible" if it can be promoted. Otherwise it returns an enum for why it cannot be promoted
    is_hidden: boolean; // If this post is marked as hidden (Applies to Pages only. Although visitor's post on Page can not be approved using this field).
    is_instagram_eligible: string; // Whether this post can be promoted in Instagram
    is_published: boolean; // Indicates whether a scheduled post was published (applies to scheduled Page Post only, for users post and instanlty published posts this value is always true)
    link: string; // The link attached to this post.
    message: string; // The status message in the post.
    message_tags: any; // Profiles tagged in message. This is an object with a unique key for each tag in the message
    name: string; // The name of the link.
    object_id: string; // The ID of any uploaded photo or video attached to the post.
    parent_id: string; // The ID of a parent post for this post, if it exists. For example, if this story is a 'Your Page was mentioned in a post' story, the parent_id will be the original post where the mention happened
    permalink_url: string; // URL to the permalink page of the post.
    picture: string; // The picture scraped from any link included with the post.
    place: IPlaceField; // Any location information attached to the post.
    privacy: any; // The privacy settings of the post.
    properties: any[]; // A list of properties for any attached video, for example, the length of the video.
    shares: any; // The shares count of this post.
    source: string; // A URL to any Flash movie or video file attached to the post.
    // Description of the type of a status update.
    // enum{mobile_status_update, created_note, added_photos, added_video, shared_story, created_group, created_event, wall_post, app_created_story, published_story, tagged_in_photo, approved_friend}
    status_type: any;
    story: string; //  Text from stories not intentionally generated by users, such as those generated when two people become friends, or when someone else posts on the person's wall.
    story_tags: any[]; // Deprecated field, same as message_tags.
    targeting: any; // Object that limited the audience for this content. Anyone not in these demographics will not be able to view this content. This will not override any Page-level demographic restrictions that may be in place.
    to: IProfileField[]; // Profiles mentioned or targeted in this post.
    type: string;// enum{link, status, photo, video, offer} A string indicating the object type of this post.
    updated_time: string; // datetime. The time when the post was created, last edited or the time of the last comment that was left on the post. For a post about a life event, this will be the date and time of the life event
    with_tags: any; // Profiles tagged as being 'with' the publisher of the post. JSON object with a data field that contains a list of Profile objects.
}
export interface ISearchParams {
    limit?: number;
    fields?: Array<keyof ISearchFields>;
    type: "place";
    center?: string;
    distance?: number;
    q?: string;
    // The available categories are: ARTS_ENTERTAINMENT, EDUCATION, FITNESS_RECREATION, FOOD_BEVERAGE, HOTEL_LODGING, MEDICAL_HEALTH, SHOPPING_RETAIL, TRAVEL_TRANSPORTATION.
    categories?: string;
}
export interface ISearchFields {
    id: string;
    about: string;
    app_links: any;
    category_list: any;
    checkins: any;
    context: any;
    cover: any;
    description: string;
    engagement: any;
    fan_count: number;
    hours: any;
    is_always_open: boolean;
    is_permanently_closed: boolean;
    is_verified: boolean;
    link: string;
    location: any;
    name: string;
    overall_star_rating: any;
    parking: any;
    phone: string;
    photos: any;
    picture: any;
    price_range: any;
    rating_count: any;
    restaurant_specialties: any;
    website: any;
}
export interface IErrorResponse {
    error: {
        message: string;
        type: string;
        code: number;
        error_subcode: number;
        fbtrace_id: string;
    };
}
export interface IClient {
    get(path: string, params: { [index: string]: any }): Promise<any>;
    setAccessToken(token: string): void;
    setFetch(newFetch: typeof fetch): void;
    group(id: string): IGroupResource;
    search(): IEdgesResource<ISearchParams, keyof ISearchFields, ISearchFields>;
}
