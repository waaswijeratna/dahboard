"use client";

import PostsTable from "@/components/posts/PostsTable";
import AuthChecker from "@/components/AuthChecker";

export default function PostsPage() {
    return (
        <AuthChecker>
            <div className="">
                <PostsTable />
            </div>
        </AuthChecker>
    );
}
