export declare namespace UserType {
  type Info = {
    id: string;
    username: string;
    name: [string?, string?, string?];
    avatar_url: string;
    picture_id?: string;
    role: [string?, string?, string?, string?];
  };

  type Content = {
    id: string;
    post: PostType.Info[];
    line: LineType.Info[];
  };

  type Subscription = {
    id: string;
    line: LineType.Subscription[];
  };

  type Notification = {
    id: string;
    viewed_notification_id: string[];
    notification: NotificationType.Info[];
  };
}

export declare namespace PostType {
  type Info = {
    id: string;
    caption?: string;
    image_id: string[];
    user_id: string;
    created_at: Date;
  };

  // TODO : Implement and finalize if required
  type Interaction = {
    reaction: string[];
  };
}

export declare namespace LineType {
  type Info = {
    id: string;
    name: string;
    description: string;
    banner_id: string;
    user_id: string;
    created_at: Date;
  };

  type Subscription = {
    id: string;
    user: UserType.Subscription[];
  };
}

export declare namespace NotificationType {
  type Info = {
    id: string;
    title: string;
    description?: string;
    origin: [string, string];
    content: [string, string];
    created_at: Date;
  };
}
