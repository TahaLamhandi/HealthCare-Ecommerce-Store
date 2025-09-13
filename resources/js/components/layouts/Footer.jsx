import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { useFavorites } from "../../contexts/FavoritesContext";
import { Button } from "../tools/button";

export default function Footer({ navigateTo }) {
  return (
    <footer className="bg-white py-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div
              className="flex items-center space-x-3 mb-6 cursor-pointer hover:opacity-80 transition-opacity duration-300"
              onClick={() => {
                if (navigateTo) {
                  navigateTo('home');
                } else {
                  window.location.href = '/';
                }
              }}
            >
              <img
                src="/images/logo.png"
                alt="Bioekleel new Logo"
                className="w-8 h-16"
                onLoad={() => console.log("Footer logo loaded: /images/logo.png")}
                onError={(e) => console.error("Failed to load footer logo: /images/logo.png")}
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Bioekleel</h3>
                <p className="text-gray-500 text-sm">Santé & Bien-être</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
              Votre partenaire de confiance pour des produits naturels et bio. Découvrez notre gamme complète pour votre
              bien-être quotidien.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Youtube, label: "YouTube" },
              ].map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 bg-gray-100 hover:bg-green-500 text-gray-600 hover:text-white rounded-xl transition-all hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Liens rapides</h4>
            <ul className="space-y-3">
              {["À propos", "Nos produits", "Blog santé", "FAQ", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-500" />
                <a href="" className="text-gray-600 hover:text-green-600 transition-colors">
                0653561000                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-500" />
                <a href="mailto:contact@bioecleel.ma" className="text-gray-600 hover:text-green-600 transition-colors">
                  contact@bioecleel.ma
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Casablanca, Maroc</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-gray-500">
            © 2024 Bioekleel. Tous droits réservés. |{" "}
            <a href="#" className="hover:text-green-500 transition-colors">
              Mentions légales
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-green-500 transition-colors">
              CGV
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}