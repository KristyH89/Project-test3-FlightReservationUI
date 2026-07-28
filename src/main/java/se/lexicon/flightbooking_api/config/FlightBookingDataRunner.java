package se.lexicon.flightbooking_api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import se.lexicon.flightbooking_api.entity.FlightBooking;
import se.lexicon.flightbooking_api.entity.FlightStatus;
import se.lexicon.flightbooking_api.repository.FlightBookingRepository;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@Profile("!test")
@RequiredArgsConstructor
public class FlightBookingDataRunner implements CommandLineRunner {

    private final FlightBookingRepository flightBookingRepository;

    @Override
    public void run(String... args) {
        // Skip seeding if flights already exist, prevents duplicate rows on every restart
        if (flightBookingRepository.count() > 0) {
            System.out.println("Flights already seeded, skipping data initialization.");
            return;
        }

        // Available flights (7) — all departing from Amsterdam, destinations based on personal travel history
        FlightBooking flight1 = FlightBooking.builder()
                .flightNumber("FL001")
                .origin("Amsterdam")
                .departureTime(LocalDateTime.now().plusDays(1))
                .arrivalTime(LocalDateTime.now().plusDays(1).plusMinutes(90)) // 1.5 hours
                .status(FlightStatus.AVAILABLE)
                .destination("Guernsey")
                .price(169.99)
                .build();

        FlightBooking flight2 = FlightBooking.builder()
                .flightNumber("FL002")
                .origin("Amsterdam")
                .departureTime(LocalDateTime.now().plusDays(2))
                .arrivalTime(LocalDateTime.now().plusDays(2).plusMinutes(210)) // 3.5 hours
                .status(FlightStatus.AVAILABLE)
                .destination("Heraklion")
                .price(299.99)
                .build();

        FlightBooking flight3 = FlightBooking.builder()
                .flightNumber("FL003")
                .origin("Amsterdam")
                .departureTime(LocalDateTime.now().plusDays(3))
                .arrivalTime(LocalDateTime.now().plusDays(3).plusMinutes(180)) // 3 hours
                .status(FlightStatus.AVAILABLE)
                .destination("Skopje")
                .price(269.99)
                .build();

        FlightBooking flight4 = FlightBooking.builder()
                .flightNumber("FL004")
                .origin("Amsterdam")
                .departureTime(LocalDateTime.now().plusDays(4))
                .arrivalTime(LocalDateTime.now().plusDays(4).plusMinutes(90)) // 1.5 hours
                .status(FlightStatus.AVAILABLE)
                .destination("Zurich")
                .price(219.99)
                .build();

        FlightBooking flight5 = FlightBooking.builder()
                .flightNumber("FL005")
                .origin("Amsterdam")
                .departureTime(LocalDateTime.now().plusDays(5))
                .arrivalTime(LocalDateTime.now().plusDays(5).plusMinutes(120)) // 2 hours
                .status(FlightStatus.AVAILABLE)
                .destination("Budapest")
                .price(239.99)
                .build();

        FlightBooking flight6 = FlightBooking.builder()
                .flightNumber("FL006")
                .origin("Amsterdam")
                .departureTime(LocalDateTime.now().plusDays(6))
                .arrivalTime(LocalDateTime.now().plusDays(6).plusMinutes(360)) // 6 hours
                .status(FlightStatus.AVAILABLE)
                .destination("Sal")
                .price(499.99)
                .build();

        FlightBooking flight7 = FlightBooking.builder()
                .flightNumber("FL007")
                .origin("Amsterdam")
                .departureTime(LocalDateTime.now().plusDays(7))
                .arrivalTime(LocalDateTime.now().plusDays(7).plusMinutes(660)) // 11 hours
                .status(FlightStatus.AVAILABLE)
                .destination("San Francisco")
                .price(899.99)
                .build();

        // Booked flights (3) — also departing from Amsterdam, with a test passenger each
        FlightBooking bookedFlight1 = FlightBooking.builder()
                .flightNumber("FL008")
                .origin("Amsterdam")
                .passengerName("Jeroen de Vries")
                .passengerEmail("jeroen.de.vries@gmail.com")
                .departureTime(LocalDateTime.now().plusDays(1))
                .arrivalTime(LocalDateTime.now().plusDays(1).plusMinutes(120)) // 2 hours
                .status(FlightStatus.BOOKED)
                .destination("Gothenburg")
                .price(189.99)
                .build();

        FlightBooking bookedFlight2 = FlightBooking.builder()
                .flightNumber("FL009")
                .origin("Amsterdam")
                .passengerName("Fleur van Beek")
                .passengerEmail("fleur.van.beek@gmail.com")
                .departureTime(LocalDateTime.now().plusDays(2))
                .arrivalTime(LocalDateTime.now().plusDays(2).plusMinutes(210)) // 3.5 hours
                .status(FlightStatus.BOOKED)
                .destination("Istanbul")
                .price(349.99)
                .build();

        FlightBooking bookedFlight3 = FlightBooking.builder()
                .flightNumber("FL010")
                .origin("Amsterdam")
                .passengerName("Bram Visser")
                .passengerEmail("bram.visser@gmail.com")
                .departureTime(LocalDateTime.now().plusDays(3))
                .arrivalTime(LocalDateTime.now().plusDays(3).plusMinutes(150)) // 2.5 hours
                .status(FlightStatus.BOOKED)
                .destination("Rome")
                .price(249.99)
                .build();

        // Save all flights
        Arrays.asList(flight1, flight2, flight3, flight4, flight5, flight6, flight7,
                        bookedFlight1, bookedFlight2, bookedFlight3)
                .forEach(flight -> {
                    try {
                        flightBookingRepository.save(flight);
                        System.out.println("Created flight: " + flight.getFlightNumber() +
                                " (Status: " + flight.getStatus() +
                                ", " + flight.getOrigin() + " -> " + flight.getDestination() + ")");
                    } catch (Exception e) {
                        System.err.println("Error creating flight: " + flight.getFlightNumber() +
                                " - " + e.getMessage());
                    }
                });

        // Print summary
        System.out.println("\nFlight Booking Statistics:");
        System.out.println("Total flights: " + flightBookingRepository.findAll().size());
        System.out.println("Available flights: " +
                flightBookingRepository.findAll().stream()
                        .filter(f -> f.getStatus() == FlightStatus.AVAILABLE)
                        .count());
        System.out.println("Booked flights: " +
                flightBookingRepository.findAll().stream()
                        .filter(f -> f.getStatus() == FlightStatus.BOOKED)
                        .count());
    }
}