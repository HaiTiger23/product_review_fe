"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Menu, X, User, Bookmark, LogOut, Star } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/app/provider/AuthContext"
import { toast } from "sonner"

// const categories = [
//   {
//     title: "Điện thoại & Máy tính bảng",
//     items: ["Điện thoại", "Máy tính bảng", "Phụ kiện"],
//   },
//   {
//     title: "Máy tính & Laptop",
//     items: ["Laptop", "Máy tính để bàn", "Linh kiện", "Màn hình"],
//   },
//   {
//     title: "Thiết bị điện tử",
//     items: ["Máy ảnh", "Âm thanh", "TV", "Thiết bị thông minh"],
//   },
//   {
//     title: "Gia dụng",
//     items: ["Tủ lạnh", "Máy giặt", "Điều hòa", "Nồi cơm điện"],
//   },
// ]

export default function Header() {
  
  const { user,logout,categories } = useAuth()
  const hanleLogout = () => {
    logout()
    toast.success("Đăng xuất thành công")
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background flex justify-center">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                ReviewHub
              </Link>
              <Link href="/products" className="block py-2 text-lg font-medium">
                Sản phẩm
              </Link>
              {categories.map((category) => (
                <div key={category.id} className="py-2">
                  <Link href={`/products?category=${encodeURIComponent(category.slug)}`} className="block py-2 text-lg font-medium">{category.name}</Link>
                 
                  {/* <div className="grid grid-cols-2 gap-2">
                    {category.children.map((item) => (
                      <Link
                        key={item.id}
                        href={`/products?category=${encodeURIComponent(item.name)}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item}
                      </Link>
                    ))}
                  </div> */}
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 font-bold text-xl mr-6">
          ReviewHub
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/products" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sản phẩm</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Danh mục</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 p-4 gap-3">
                  {categories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <Link href={`/products?category=${encodeURIComponent(category.slug)}`} className="block py-2 text-lg font-medium">{category.name}</Link>
                      {/* <ul className="space-y-1">
                        {category.children.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={`/products?category=${encodeURIComponent(item.name)}`}
                              className="text-sm text-muted-foreground hover:text-foreground"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul> */}
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center ml-auto gap-2">
         

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile?tab=reviews" className="flex items-center cursor-pointer">
                    <Star className="mr-2 h-4 w-4" />
                    <span>Đánh giá của tôi</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile?tab=bookmarks" className="flex items-center cursor-pointer">
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span>Sản phẩm đã lưu</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={hanleLogout} className="flex items-center cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
