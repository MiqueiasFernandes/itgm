package com.itgm.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Customize.
 */
@Entity
@Table(name = "customize")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Customize implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "sidebar")
    private Boolean sidebar;

    @Column(name = "color")
    private String color;

    @Column(name = "projeto")
    private Long projeto;

    @Column(name = "cenario")
    private Long cenario;

    @Column(name = "desktop")
    private String desktop;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isSidebar() {
        return sidebar;
    }

    public Customize sidebar(Boolean sidebar) {
        this.sidebar = sidebar;
        return this;
    }

    public void setSidebar(Boolean sidebar) {
        this.sidebar = sidebar;
    }

    public String getColor() {
        return color;
    }

    public Customize color(String color) {
        this.color = color;
        return this;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getProjeto() {
        return projeto;
    }

    public Customize projeto(Long projeto) {
        this.projeto = projeto;
        return this;
    }

    public void setProjeto(Long projeto) {
        this.projeto = projeto;
    }

    public Long getCenario() {
        return cenario;
    }

    public Customize cenario(Long cenario) {
        this.cenario = cenario;
        return this;
    }

    public void setCenario(Long cenario) {
        this.cenario = cenario;
    }

    public String getDesktop() {
        return desktop;
    }

    public Customize desktop(String desktop) {
        this.desktop = desktop;
        return this;
    }

    public void setDesktop(String desktop) {
        this.desktop = desktop;
    }

    public User getUser() {
        return user;
    }

    public Customize user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Customize customize = (Customize) o;
        if (customize.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, customize.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Customize{" +
            "id=" + id +
            ", sidebar='" + sidebar + "'" +
            ", color='" + color + "'" +
            ", projeto='" + projeto + "'" +
            ", cenario='" + cenario + "'" +
            ", desktop='" + desktop + "'" +
            '}';
    }
}
