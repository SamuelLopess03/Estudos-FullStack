"use client";

import React from "react";
import { BoxSelect } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Input } from "./ui/input";

import { blogCategories, useAppData } from "@/context/AppContext";

const SideBar = () => {
  const { searchQuery, setSearchQuery, setCategory } = useAppData();

  return (
    <Sidebar>
      <SidebarHeader className="bg-white text-2xl font-bold mt-5">
        The Reading Retreat
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Search</SidebarGroupLabel>
          <Input
            type="text"
            placeholder="Search Your Desired Blog"
            value={searchQuery}
            onChange={(element) => setSearchQuery(element.target.value)}
          />

          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setCategory("")}>
                <BoxSelect /> <span>All</span>
              </SidebarMenuButton>

              {blogCategories?.map((element, index) => {
                return (
                  <SidebarMenuButton
                    key={index}
                    onClick={() => setCategory(element)}
                  >
                    <BoxSelect /> <span>{element}</span>
                  </SidebarMenuButton>
                );
              })}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
